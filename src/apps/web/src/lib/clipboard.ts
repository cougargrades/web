/*
Copyright (c) 2018 GitHub, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/github/clipboard-copy-element
*/


function createNode(text: string): Element {
  const node = document.createElement('pre')
  node.style.width = '1px'
  node.style.height = '1px'
  node.style.position = 'fixed'
  node.style.top = '5px'
  node.textContent = text
  return node
}

export function copyNode(node: Element): Promise<void> {
  if ('clipboard' in navigator) {
    return navigator.clipboard.writeText(node.textContent || '')
  }

  const selection = getSelection()
  if (selection == null) {
    return Promise.reject(new Error())
  }

  selection.removeAllRanges()

  const range = document.createRange()
  range.selectNodeContents(node)
  selection.addRange(range)

  document.execCommand('copy')
  selection.removeAllRanges()
  return Promise.resolve()
}

export function copyText(text: string): Promise<void> {
  if ('clipboard' in navigator) {
    return navigator.clipboard.writeText(text)
  }

  const body = document.body
  if (!body) {
    return Promise.reject(new Error())
  }

  const node = createNode(text)
  body.appendChild(node)
  copyNode(node)
  body.removeChild(node)
  return Promise.resolve()
}
