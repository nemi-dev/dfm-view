export function download(fname: string, content: string, type: string = "text/plain") {
  const blob = new Blob([content], { type })

  const a = document.createElement('a')
  a.setAttribute("download", fname)
  a.setAttribute("href", window.URL.createObjectURL(blob))
  a.click()
  
}
