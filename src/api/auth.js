import seedUsers from '../data/mockUsers.json' with { type: 'json' }

// shortcut: картотека пользователей живёт только в памяти — reload страницы её сбрасывает;
// заводим бэкенд, когда он появится
const users = [...seedUsers]
const wait = (ms = 400) => new Promise((r) => setTimeout(r, ms))

export async function loginUser(email, password) {
  await wait()
  const u = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
  )
  if (!u) throw new Error('Неверная почта или пароль.')
  return { id: u.id, name: u.name, email: u.email }
}

export async function registerUser(name, email, password) {
  await wait()
  if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
    throw new Error('Такая почта уже зарегистрирована.')
  }
  const user = { id: users.length + 1, name: name.trim(), email: email.trim(), password }
  users.push(user)
  return { id: user.id, name: user.name, email: user.email }
}
