const genNickName = (() => {
  let n = 1
  return () => `User${n++}`
})()

export default class User {
  users = new Map()

  add(socket) {
    this.users.set(socket, {
      nickName: genNickName()
    })
    return this
  }

  remove(socket) {
    this.users.delete(socket)
    return this
  }

  makeMsg(socket, msg) {
    const u = this.users.get(socket)
    return {
      from: u.nickName,
      msg
    }
  }
}
