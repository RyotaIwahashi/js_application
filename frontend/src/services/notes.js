import axios from 'axios'
// const baseUrl = 'http://localhost:3001/api/notes'
const baseUrl = '/api/notes' // バックエンドにbuildフォルダをコピーして渡した場合はドメインは省略可能になる
// ただし、開発モードではフロントエンドがアドレスlocalhost:3000にあるため、バックエンドへのリクエストは間違ったアドレスlocalhost:3000/api/notesに送られる。

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  return response.data
}

// export default {
//   getAll: getAll,
//   create: create,
//   update: update,
// }

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, update }
