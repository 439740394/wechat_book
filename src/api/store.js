import axios from 'axios'
import { setLocalForage } from '../utils/localForage'

export function flatList () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/flat-list`
  })
}

export function home () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/home`
  })
}

export function detail (book) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
    params: {
      fileName: book.fileName
    }
  })
}

export function list () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/list`
  })
}

export function shelf () {
  return axios({
    methods: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/shelf`
  })
}

/* 书籍本地存储 */
export function cacheBook (book, onSuccess, onError, onProgress) {
  if (!onProgress) {
    onProgress = onError
    onError = null
  }
  return axios.create({
    baseURL: `${process.env.VUE_APP_EPUB_URL}`,
    method: 'get',
    responseType: 'blob',
    timeout: 180 * 1000,
    onDownloadProgress: progressEvent => {
      onProgress && onProgress(progressEvent)
    }
  }).get(`${book.categoryText}/${book.fileName}.epub`).then(res => {
    const blob = new Blob([res.data])
    setLocalForage(book.fileName, blob, () => {
      onSuccess && onSuccess(res)
    }, () => {
      onError && onError()
    })
  }).catch(err => {
    onError && onError(err)
  })
}
