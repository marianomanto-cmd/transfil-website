# Importación en Google Ads Editor — Search `/conformado`

CSV para cargar las cuatro campañas del plan
[`../conformado-search.md`](../conformado-search.md) en Google Ads Editor.
Salen de los mismos datos que las tablas del plan. UTF-8, separados por
coma.

| Archivo | Filas | Qué carga |
|---|---|---|
| 01-campanas.csv | 4 | Las 4 campañas, en pausa: tipo, red, estrategia, horario, sufijo de URL |
| 02-ubicaciones.csv | 11 | Países por campaña |
| 03-grupos.csv | 28 | Grupos de anuncios con su sufijo de URL (UTM) |
| 04-keywords.csv | 388 | Palabras clave (frase y exacta) |
| 05-negativas-campana.csv | 694 | Negativas a nivel campaña |
| 06-negativas-grupo.csv | 226 | Negativas a nivel grupo |
| 07-anuncios.csv | 28 | Un RSA por grupo (15 títulos, 4 descripciones, fijaciones) |
| 08-sitelinks.csv | 24 | Sitelinks a las anclas de la landing |
| 09-textos-destacados.csv | 37 | Textos destacados |
| 10-fragmentos.csv | 8 | Fragmentos estructurados |
| 11-ubicaciones-clusters.csv | 48 | Estados, provincias y ciudades con su ajuste de puja (no es para Editor: se cargan con "Ubicaciones masivas", §3.6 del plan) |

## Cómo importar

1. Abrí la cuenta en Google Ads Editor y bajá los cambios recientes.
2. **Cuenta → Importar → Desde archivo…** y cargá los archivos **en orden,
   de 01 a 10**: cada uno se engancha con los anteriores por el nombre de
   campaña y de grupo.
3. En cada importación, revisá la **vista previa**. Los encabezados están
   en inglés, como los exporta Editor (los reconoce aunque la interfaz esté
   en español; mayúsculas y espacios no importan). Si alguno no se mapea
   solo, elegí la columna correcta en el desplegable.
4. Cargá presupuestos y Max CPC (abajo), revisá los errores que marque
   Editor y **publicá**.
5. Terminá en la web de Google Ads lo que Editor no cubre: checklist §11 del
   plan.

## Lo que los CSV no traen, a propósito

- **Montos.** Presupuestos y Max CPC dependen de la moneda de la cuenta
  (ARS o USD). Se cargan a mano después de importar 01 y 03, con el índice
  de puja del plan (§9). Hasta entonces Editor puede marcar error de
  presupuesto o de puja: es esperado.
- **Ajustes que se hacen en la web:** AI Max, concordancia amplia a nivel
  campaña, opción de ubicación "Presencia", recursos automáticos y
  objetivos de conversión (§8 y §11 del plan).
- **Llamada, imágenes, logo y nombre del negocio** (§7.4–7.5 del plan).

## Decisiones de formato

- **Negativas de campaña** (`05`): `Criterion Type = Campaign Negative
  Phrase`, sin columna de grupo. Si Editor no reconoce ese valor, usá
  *Palabras clave negativas de campaña → Hacer varios cambios*, pegá la
  columna `Keyword` y elegí las campañas de destino (AR, MX y LATAM
  comparten la misma lista).
- **Negativas de grupo** (`06`): `Criterion Type = Negative Phrase`, con
  grupo.
- **Fijaciones** (`07`): `Headline N position = 1` en los títulos fijados;
  vacío = libre.
- **Horario** (`01`): `(Monday[07:00-20:00]);…`, en la zona horaria de la
  cuenta.
- **Sin idioma** (`01`): Google quitó el idioma de las campañas de Search
  en septiembre de 2026; el idioma lo deciden el anuncio, la landing y la
  consulta.
- **Clústeres** (`11`): no es para Editor. Son los estados, provincias y
  ciudades con recargo de puja; se cargan en la web con *Ubicaciones
  masivas* (§3.6 del plan).
- **Ubicaciones** (`02`): nombre en inglés + ID de criterio de Google, por
  si el nombre resulta ambiguo.
- **Fragmentos** (`10`): encabezado en inglés (`Types`, `Service catalog`)
  + columna `Language`; valores separados por `;`. Si Editor no los toma
  son dos por campaña: cargalos a mano desde §7.3 del plan.
- Las campañas entran **en pausa** (`Paused`): nada sale al aire hasta
  activarlas.

## Si algo no se importa

Todo está también en tablas en el plan (§3–§7). Cargá a mano lo que falte.

## Cambios

Los archivos salieron de un generador que valida los límites de Google
(títulos ≤ 30, descripciones ≤ 90, rutas ≤ 15, sitelinks ≤ 25 / 35, textos
destacados ≤ 25, valores de fragmentos ≤ 25), que no hay keywords ni títulos
repetidos y que ninguna negativa bloquea una keyword propia. Si los editás
a mano, Editor vuelve a validar los largos al importar; lo de las
negativas, revisalo vos.
