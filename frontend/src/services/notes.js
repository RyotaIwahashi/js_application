import axios from 'axios'
// const baseUrl = 'http://localhost:3001/api/notes'
const baseUrl = '/api/notes' // バックエンドにbuildフォルダをコピーして渡した場合はドメインは省略可能になる
// ただし、開発モードではフロントエンドがアドレスlocalhost:3000にあるため、バックエンドへのリクエストは間違ったアドレスlocalhost:3000/api/notesに送られる。

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

// export default {
//   getAll: getAll,
//   create: create,
//   update: update,
// }

export default { getAll, create, update }
