import fs from 'fs'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

async function updateSvg() {
  const logoPurePath = path.join(root, 'public', 'logo-transparent.png')
  const logoBuffer = fs.readFileSync(logoPurePath)
  const base64 = logoBuffer.toString('base64')
  
  const m = await sharp(logoBuffer).metadata()
  const width = m.width
  const height = m.height

  // Cria um SVG limpo, vetorial/container com a imagem transparente perfeitamente ajustada
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image width="${width}" height="${height}" xlink:href="data:image/png;base64,${base64}" />
</svg>`

  fs.writeFileSync(path.join(root, 'public', 'logo.svg'), svgContent)
  fs.writeFileSync(path.join(root, 'logo.svg'), svgContent)
  console.log('✓ public/logo.svg e logo.svg atualizados com a logo limpa e transparente!')
}

updateSvg().catch(console.error)
