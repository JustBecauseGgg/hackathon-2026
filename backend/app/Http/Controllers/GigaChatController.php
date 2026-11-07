<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

// shortcut: пользователи/колоды всё ещё in-memory на фронте; тут только прокси к LLM
class GigaChatController extends Controller
{
    public function cards(Request $request)
    {
        $v = Validator::make($request->all(), [
            'text'  => 'required|string|min:20|max:50000',
            'topic' => 'nullable|string|max:200',
        ]);
        if ($v->fails()) {
            return response()->json(['error' => $v->errors()->first()], 422);
        }

        $key = config('services.gigachat.key');
        if (! $key) {
            return response()->json(['error' => 'GIGACHAT_API_KEY не задан на сервере'], 500);
        }

        $payload = [
            'model' => config('services.gigachat.model'),
            'messages' => [
                ['role' => 'system', 'content' => config('services.gigachat.system_prompt')],
                ['role' => 'user', 'content' => "Тема: {$request->input('topic', '')}\n\nТекст:\n{$request->input('text')}"],
            ],
            'temperature' => 0.2,
        ];

        $r = Http::withToken($key)
            ->timeout(120)
            ->post(config('services.gigachat.url'), $payload);

        if ($r->failed()) {
            return response()->json([
                'error' => "GigaChat {$r->status()}: {$r->body()}",
            ], 502);
        }

        $raw = $r->json('choices.0.message.content', '');
        // модель может завернуть JSON в ```-блок — снимаем обёртку
        $clean = preg_replace('/^```(?:json)?\s*|\s*```$/s', '', trim($raw));
        $cards = json_decode($clean, true);

        if (! is_array($cards)) {
            return response()->json(['error' => 'Модель вернула не-JSON ответ', 'raw' => $raw], 502);
        }

        // нормализация ключей (модель шлёт term/definition) + мягкая валидация + лимит 20
        $cards = array_slice(array_values(array_filter(array_map(function ($c, $i) {
            if (! is_array($c)) return null;
            $q = $c['question'] ?? $c['term'] ?? null;
            $a = $c['answer'] ?? $c['definition'] ?? null;
            if (empty($q) || empty($a)) return null;
            return [
                'id' => $c['id'] ?? 'card_' . ($i + 1),
                'question' => $q,
                'answer' => $a,
                'source_quote' => $c['source_quote'] ?? '',
                'topic' => $c['topic'] ?? null,
            ];
        }, $cards, array_keys($cards)))), 0, 20);

        return response()->json(['cards' => $cards]);
    }
}
