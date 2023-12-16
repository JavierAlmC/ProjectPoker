import { getData, createData, updateData } from './supaConnection.js'

export { getGame, createNewGame, updateGame }

async function getGame (uid) {
  const token = localStorage.getItem('access_token')
  const data = await getData(`status?user=eq.${uid}&select=*`, token)
  return data[0]
}
async function createNewGame (uid, game) {
  const token = localStorage.getItem('access_token')
  let data = await getData(`status?user=eq.${uid}&select=*`, token)
  if (typeof data[0] === 'undefined') {
    await createData('status', token, { user: uid, gameState: game })
  }
  // Si la taula ja esta creada, hi ha que actualitzar a una buida
  await updateData(`status?user=eq.${uid}`, token, { user: uid, gameState: game })
  data = await getData(`status?user=eq.${uid}&select=*`, token)
  return data[0]
}
async function updateGame (state, uid) {
  const token = localStorage.getItem('access_token')
  await updateData(`status?user=eq.${uid}`, token, { user: uid, gameState: state })
}
