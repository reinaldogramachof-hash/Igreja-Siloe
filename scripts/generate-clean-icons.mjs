import fs from 'fs'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

async function processLogo() {
  const extracted = path.join(root, 'scripts', 'extracted.png')
  
  // 1. Carrega os dados brutos de pixels (RGBA) da imagem de 2700x2700
  const { data, info } = await sharp(extracted)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  // 2. Transforma pixels brancos / quase brancos (R>245, G>245, B>245) em transparentes (alpha = 0)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    
    // Se o pixel for branco ou quase branco
    if (r > 240 && g > 240 && b > 240) {
      data[i + 3] = 0 // Alfa totalmente transparente
    }
  }

  // 3. Cria a imagem com fundo transparente e faz o trim para obter apenas a logo exata
  const transparentBuffer = await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png()
    .toBuffer()

  // 4. Faz o trim para recortar a logo sem qualquer margem branca ou vazia
  const trimmed = await sharp(transparentBuffer)
    .trim()
    .toBuffer({ resolveWithObject: true })

  console.log('Logo pura recortada sem margens:', trimmed.info)
  
  // Salva a logo pura transparente
  const logoPurePath = path.join(root, 'public', 'logo-transparent.png')
  fs.writeFileSync(logoPurePath, trimmed.data)
  console.log('✓ Salvo:', logoPurePath)

  // 5. Agora vamos gerar os ícones PWA onde a logo preenche o espaço de forma centralizada e sem margem branca
  const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512]
  const iconsDir = path.join(root, 'public', 'icons')

  for (const size of sizes) {
    // Para cada tamanho, enquadra a logo proporcionalmente (ocupando 85% do espaço central com fundo transparente)
    const innerSize = Math.round(size * 0.88)
    const logoResized = await sharp(trimmed.data)
      .resize({
        width: innerSize,
        height: innerSize,
        fit: 'inside',
      })
      .toBuffer()

    const outFile = path.join(iconsDir, `icon-${size}x${size}.png`)
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: logoResized, gravity: 'center' }])
      .png()
      .toFile(outFile)

    console.log(`✓ Ícone gerado: ${outFile}`)
  }

  // apple-touch-icon (180x180)
  const appleTouchIcon = path.join(root, 'public', 'apple-touch-icon.png')
  const appleInner = Math.round(180 * 0.9)
  const appleResized = await sharp(trimmed.data)
    .resize({ width: appleInner, height: appleInner, fit: 'inside' })
    .toBuffer()

  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: appleResized, gravity: 'center' }])
    .png()
    .toFile(appleTouchIcon)
  console.log(`✓ Apple Touch Icon: ${appleTouchIcon}`)

  // favicon-32x32.png
  const favicon32 = path.join(root, 'public', 'favicon-32x32.png')
  await sharp(trimmed.data)
    .resize(32, 32, { fit: 'inside' })
    .png()
    .toFile(favicon32)
  console.log(`✓ Favicon 32: ${favicon32}`)
}

processLogo().catch(console.error)
