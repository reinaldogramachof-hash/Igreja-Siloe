// Script para gerar todos os ícones PNG necessários para o PWA
// Usa o sharp que já vem como dependência do Next.js
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const inputSvg = path.join(root, 'logo.svg')
const outputDir = path.join(root, 'public', 'icons')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512]

async function generate() {
  const svgBuffer = fs.readFileSync(inputSvg)

  for (const size of sizes) {
    const outFile = path.join(outputDir, `icon-${size}x${size}.png`)
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outFile)
    console.log(`✓ Generated: ${outFile}`)
  }

  // apple-touch-icon (180x180) also to public root
  const appleTouchIcon = path.join(root, 'public', 'apple-touch-icon.png')
  await sharp(svgBuffer).resize(180, 180).png().toFile(appleTouchIcon)
  console.log(`✓ Generated: ${appleTouchIcon}`)

  // favicon-32x32.png
  const favicon32 = path.join(root, 'public', 'favicon-32x32.png')
  await sharp(svgBuffer).resize(32, 32).png().toFile(favicon32)
  console.log(`✓ Generated: ${favicon32}`)

  console.log('\n✅ All icons generated successfully!')
}

generate().catch(console.error)
