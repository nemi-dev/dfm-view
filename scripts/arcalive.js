import { Renderer, marked } from 'marked'
import { baseUrl } from "marked-base-url"
import fs from 'fs'

const readmeContent = fs.readFileSync("./README.md", { encoding: 'utf8' })

const defaultRenderer = new Renderer({ gfm: true })

const fontMap = {
  1: 'margin-block:0.67em; font-size:2em;',
  2: 'margin-block:0.83em; font-size:1.5em;',
  3: 'margin-block:1em; font-size:1.17em;',
  4: 'margin-block:1.33em;',
  5: 'margin-block:1.67em; font-size:0.83em;',
  6: 'margin-block:2.33em; font-size:0.67em;',
}

/** @type {marked.Renderer} */
const renderer = {
  link(href, title, text) {
    if (href == "CHANGELOG.md") href = "https://github.com/nemi-dev/dfm-view/blob/main/CHANGELOG.md"
    const s = defaultRenderer.link(href, title, text)
    if (href.startsWith('#')) return s
    return s.replace('<a', '<a target="_blank" rel="noopener noreferrer"')
  },
  heading(text, level) {
    const s = defaultRenderer.heading(text, level)
    const fontSize = fontMap[level]
    return s.replace(`<h${level}`, `<div style="font-weight:bold; ${fontSize}"`).replace(`</h${level}`, `</div`)
  }
}

marked.use({ renderer })
const a = marked.parse(readmeContent, { async: false, gfm: true })

fs.writeFileSync("README.arcalive.html", a, { encoding: 'utf8' })

