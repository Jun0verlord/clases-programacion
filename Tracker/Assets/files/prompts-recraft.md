# Prompts de Recraft · Set de iconos Tsumi (積)

Los prompts describen exactamente el mismo sistema que los SVG: rejilla 24×24, trazo uniforme de 1,75 px, terminaciones redondeadas y **un solo remate de pincel más grueso por icono**.

## Antes de generar

1. En Recraft elige el modo **Vector** y el estilo **Icon** (línea / outline).
2. Sube como **referencia de estilo** un PNG de 3 o 4 de mis SVG (`library`, `history`, `search`). Es lo que más ayuda a mantener la uniformidad.
3. Fija el color: una sola tinta, `#1C1C1C`, sobre fondo transparente o blanco.
4. Genera **todo el set en la misma sesión** y con el mismo estilo. No mezcles estilos entre iconos.
5. Exporta en SVG y, en Inkscape o Figma, deja los trazos como `currentColor` (ver "Después de generar").

## Bloque base (pégalo al inicio de cada prompt)

```
Minimal outline icon, single color ink black, uniform 1.75px stroke on a 24x24 grid,
rounded line caps and rounded joins, no fill, no gradients, no shadows, no texture.
Sumi-e inspired restraint: one single detail of the icon ends in a slightly heavier
brush-pressed stroke (about 3px), everything else stays clean and geometric.
Centered, 2px safe padding, flat vector, transparent background.
```

## Negative prompt (si la herramienta lo permite)

```
color, gradient, 3d, shadow, glow, neon, filled shapes, multiple stroke widths,
realistic, photo, text, letters, watermark, background, frame, rounded square container
```

## Prompts por icono

Cada uno es: **bloque base + descripción**.

| Icono | Descripción a añadir |
|---|---|
| **library** | Three upright book spines side by side, the third one leaning slightly to the right (about 14 degrees). Brush-pressed heavier mark: a short vertical label stroke near the top of the first spine. |
| **updates** | Two circular arrows chasing each other forming a refresh cycle, arrowheads as small right-angle corners. Brush-pressed heavier mark: a single dot at the center. |
| **history** | A circle clock with a counterclockwise arrow at the upper left, one clock hand pointing up. Brush-pressed heavier mark: the second hand, a short diagonal stroke from the center to the lower right. |
| **browse** | A compass inside a circle, the needle as a small diamond pointing to the upper right. Brush-pressed heavier mark: a dot at the center of the needle. |
| **settings** | Three horizontal slider lines, each with a small hollow circular knob at different positions (right, left, right). Brush-pressed heavier mark: the end segment of the bottom line. |
| **favorites** | A simple symmetrical heart outline. Brush-pressed heavier mark: a small curved highlight stroke inside the upper left lobe. |
| **search** | A magnifying glass, a perfect circle with a straight diagonal handle to the lower right. Brush-pressed heavier mark: the handle. |
| **reading** | An open book seen from the front, two curved pages meeting at the spine. Brush-pressed heavier mark: the central spine line. |

Ejemplo completo (`search`):

```
Minimal outline icon, single color ink black, uniform 1.75px stroke on a 24x24 grid,
rounded line caps and rounded joins, no fill, no gradients, no shadows, no texture.
Sumi-e inspired restraint: one single detail of the icon ends in a slightly heavier
brush-pressed stroke (about 3px), everything else stays clean and geometric.
Centered, 2px safe padding, flat vector, transparent background.
A magnifying glass, a perfect circle with a straight diagonal handle to the lower right.
Brush-pressed heavier mark: the handle.
```

## Icono de la app (aparte del set)

Este sí puede ser una ilustración, no un icono de línea:

```
App icon, single large calligraphic kanji 積 painted with a wet black sumi ink brush,
bold confident strokes with dry-brush edges, centered inside the safe zone (central 66%),
matte off-white washi paper background (#F4F1EA), a tiny vermilion hanko seal (#B3342A)
with the character 文 at the lower left, subtle paper grain, no gradients, no glow,
flat matte look, square format 1024x1024.
```

Para Android necesitas dos capas: el kanji y el sello como primer plano, y el fondo liso aparte. Pídelo en dos generaciones (fondo liso / kanji sobre transparente) o sepáralo después con la vectorización.

## Después de generar

- Abre cada SVG y reemplaza `stroke="#1C1C1C"` por `stroke="currentColor"`. El remate de pincel debe usar `stroke="var(--icon-accent, currentColor)"`.
- Comprueba que todos tengan `viewBox="0 0 24 24"` y `fill="none"`.
- Si Recraft devuelve figuras rellenas en vez de trazos, aplica *Outline stroke* inverso o vuelve a generar con "outline, stroke only" al inicio del prompt.
- Compara siempre con `preview.html` poniendo tus iconos junto a los míos: el grosor y el tamaño visual deben coincidir.
