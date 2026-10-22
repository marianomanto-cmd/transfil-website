# Campaña de Search — `/conformado`

Plan de Google Ads Search para la landing de conformado de tubos. Los
archivos para importar en Google Ads Editor están en
[`conformado-search/`](./conformado-search/) y salen de los mismos datos que
las tablas de abajo. **Nada está publicado:** las campañas se importan en
pausa y se activan después del checklist (§11).

> **Volumen.** Es un nicho B2B: pocas búsquedas por mes y cada lead vale
> mucho. El techo lo va a poner el volumen de búsqueda, no el presupuesto.
> No esperar cientos de clics; esperar pocos y buenos.

---

## 0. Resumen

| Campaña | Ubicación | URL final | Horario (hora de la cuenta) | Presupuesto inicial* |
|---|---|---|---|---|
| `TF \| Search \| Conformado \| AR \| ES` | Argentina | `transfil.com.ar/conformado` | lun–vie 07–20 · sáb 08–13 | USD 6/día |
| `TF \| Search \| Conformado \| MX \| ES` | México | `transfil.com.ar/conformado` | lun–vie 10–23 · sáb 11–16 (07–20 y 08–13 en Monterrey y CDMX) | USD 9/día |
| `TF \| Search \| Conformado \| LATAM \| ES` | Perú, Colombia, Chile, Ecuador, Bolivia, Paraguay, Uruguay, República Dominicana | `transfil.com.ar/conformado` | lun–vie 09–22 · sáb 09–16 (07–20 en Lima, Bogotá y Quito) | USD 6/día |
| `TF \| Search \| Conformado \| BR \| PT` | Brasil | `transfil.com.ar/pt/conformado` | lun–vie 07–20 · sáb 08–13 (Brasília = hora AR) | USD 9/día |

\* Punto de partida en USD, **a validar en el Planificador de palabras clave
antes de lanzar** (§9): USD 30/día entre las cuatro. Horarios en la zona
horaria de la cuenta (se asume Argentina, UTC−3).

Mercados, ubicaciones y presupuesto salen del informe
[Geo targeting: conformadoras de tubos en Latinoamérica](./conformado-geo-latam.md):
dónde están las plantas de tubo, perfilado y trefilado, y dónde se invirtió
en 2023–2026.

---

## 1. Objetivo y KPI

Objetivo: **pedidos de relevamiento en planta** de plantas con líneas de
conformado (tubos ERW / HFW, perfilado, trefilado), por formulario o por
WhatsApp. No se optimiza por clics ni por visitas.

| KPI | Cómo se mide |
|---|---|
| Leads | Conversiones primarias: formulario + WhatsApp (§2.1) |
| Costo por lead | Costo / conversiones primarias |
| Leads calificados | Importación offline desde la planilla de ventas (§2.3) |
| Tasa de conversión de la landing | Conversiones / clics |
| CTR y cuota de impresiones de búsqueda | Google Ads, por grupo |

No fijar un costo por lead objetivo hasta tener 4 semanas de datos: con este
volumen, lo de las primeras semanas no es estadística.

---

## 2. Medición — antes de lanzar

Sin esto no se lanza. Los eventos ya salen del sitio
([`LANDINGS.md`](../LANDINGS.md) §5); falta crear las acciones de conversión
en Google Ads y los tags en GTM (`GTM-PV9STD3`).

### 2.1 Acciones de conversión

| Acción en Google Ads | Disparador | Tipo | Categoría | Recuento | Ventana de clic |
|---|---|---|---|---|---|
| Lead – Formulario | evento `generate_lead` | **Primaria** | Enviar formulario de clientes potenciales | Una | 90 días |
| Lead – WhatsApp | evento `whatsapp_click` | **Primaria** | Contacto | Una | 90 días |
| Clic en teléfono | evento `click_phone` | Secundaria (observación) | Contacto | Una | 30 días |
| Lead calificado | importación offline (§2.3) | Secundaria al inicio | Cliente potencial calificado | Una | 90 días |

Reglas:

- **`whatsapp_click`, no `click_whatsapp`.** En la landing salen los dos en
  el mismo clic; si los dos son conversión, cada WhatsApp cuenta doble.
- **`generate_lead` sin filtrar por `page`.** Si alguien entra por el
  anuncio, pasa al home y deja el formulario ahí, el lead igual es de la
  campaña. Google Ads solo atribuye a quien hizo clic en un anuncio, así que
  esto no infla nada.
- Atribución: basada en datos (la predeterminada).
- Valores: pendiente (§13). Si no hay un valor real de lead, usar valores
  relativos solo para reportes (p. ej. formulario 1, WhatsApp 0,5).
- Si GA4 está vinculado, **no** importar también el `generate_lead` de GA4
  como primaria: se contaría dos veces.

### 2.2 GTM (`GTM-PV9STD3`)

La configuración completa del sitio (eventos, etiquetas de GA4 y de Google
Ads, conversiones avanzadas) está en [`MEDICION.md`](../MEDICION.md), con
un contenedor para importar en [`gtm/transfil-medicion.json`](../gtm/transfil-medicion.json).
`whatsapp_click` sale en **todas** las páginas, no solo en la landing: si
alguien entra por el anuncio y escribe desde el home, también cuenta.
Lo mínimo para esta campaña:

1. Tag **Vinculador de conversiones** → activador *Todas las páginas*.
2. Tag **Seguimiento de conversiones de Google Ads** "Lead – Formulario" →
   activador *Evento personalizado* `generate_lead`.
3. Ídem "Lead – WhatsApp" → `whatsapp_click`.
4. Ídem "Clic en teléfono" → `click_phone`.
5. Google Ads → Configuración de la cuenta → **Etiquetado automático:
   activado**.
6. Probá con *Vista previa* de GTM + Tag Assistant: un envío real del
   formulario de la landing y un clic en WhatsApp. Cada tag tiene que
   disparar **una** vez. Después, el diagnóstico de cada acción en Google
   Ads tiene que pasar a "Registrando conversiones".

### 2.3 Leads calificados (importación offline)

El mail que llega a ventas@ ya trae el `gclid` y las UTM
([`LANDINGS.md`](../LANDINGS.md) §6). Con eso se le devuelve a Google qué
leads valieron la pena:

1. Google Ads → Objetivos → Conversiones → Nueva → **Importar** → clics
   desde otras fuentes (CRM / archivos) → crear "Lead calificado" (y, si
   sirve, "Cotización enviada").
2. Una Google Sheet con la plantilla que da Google al crear la acción
   (Google Click ID, Conversion Name, Conversion Time con zona horaria,
   Conversion Value, Conversion Currency).
3. Ventas pega el `gclid` del mail cuando califica el lead. Carga
   programada diaria desde la planilla.
4. El clic tiene que tener menos de 90 días. Leads de iPhone pueden traer
   `gbraid` / `wbraid` en lugar de `gclid`; si la plantilla no los acepta,
   esos no se pueden subir.

Primero sirve para reportes (qué keyword trae leads buenos). Pujar por
"Lead calificado" recién cuando haya volumen.

### 2.4 Conversiones avanzadas para leads

El formulario ya empuja `user_data` (mail y teléfono hasheados con
SHA-256) junto con `generate_lead`. Falta activarlo en la acción de
conversión y en la etiqueta de GTM ([`MEDICION.md`](../MEDICION.md) §3,
paso 5). Mejora la atribución; no es requisito para lanzar.

---

## 3. Estructura

### 3.1 Nombres

| Elemento | Formato | Ejemplo |
|---|---|---|
| Campaña | `TF \| Search \| <Landing> \| <Mercado> \| <Idioma>` | `TF \| Search \| Conformado \| AR \| ES` |
| Grupo | `<NN> \| <Tema>` | `01 \| Conformado tubos` |
| `utm_campaign` | `<landing>_search_<mercado>_<idioma>` | `conformado_search_ar_es` |
| `utm_content` | `<nn>-<tema>` | `01-conformado-tubos` |

La próxima landing (lavado, transporte, hornos) repite el formato.

### 3.2 Campañas

Cuatro campañas, cada una con presupuesto propio para que un mercado no se
coma al otro:

- **AR (ES)** → `/conformado`. Mercado local: repuestos sin importación,
  servicio directo, llamada.
- **MX (ES)** → `/conformado`. México tiene la base de molinos ERW más
  densa de la región y la mayor inversión nueva, y está en UTC−6: con
  campaña propia tiene presupuesto aislado, horario local e informes
  limpios. Mismo contenido que LATAM.
- **LATAM (ES)** → `/conformado`. Perú, Colombia, Chile, Ecuador, Bolivia,
  Paraguay, Uruguay y República Dominicana. Mismos grupos, keywords y
  negativas que AR; cambian un título, la descripción de confianza, un
  sitelink y un texto destacado (§6.2), porque para ellos un repuesto desde
  Córdoba sí es importación.
- **BR (PT)** → `/pt/conformado`. Keywords propias: en Brasil
  "refrigerante" es gaseosa (§4.2).

| Campaña | Países (ID de criterio) |
|---|---|
| `TF \| Search \| Conformado \| AR \| ES` | Argentina (2032) |
| `TF \| Search \| Conformado \| MX \| ES` | México (2484) |
| `TF \| Search \| Conformado \| LATAM \| ES` | Perú (2604), Colombia (2170), Chile (2152), Ecuador (2218), Bolivia (2068), Paraguay (2600), Uruguay (2858), República Dominicana (2214) |
| `TF \| Search \| Conformado \| BR \| PT` | Brasil (2076) |

### 3.3 Grupos — ES (AR, MX y LATAM)

| Grupo | Intención | Frase | Exacta | Índice de puja | utm_content |
|---|---|---|---|---|---|
| `01 \| Conformado tubos` | Aplicación: formadoras ERW / HFW, perfiladoras, trefilado. Alta intención, bajo volumen. | 15 | 4 | 130 | `01-conformado-tubos` |
| `02 \| Filtración soluble` | Categoría: filtración de refrigerante / soluble / emulsión / fluido de corte. | 16 | 4 | 100 | `02-filtracion-soluble` |
| `03 \| Central de filtrado` | Sistema completo: central / filtración centralizada. Ticket más alto. | 10 | 3 | 120 | `03-central-filtrado` |
| `04 \| Separador magnético` | Etapa F01: finos ferrosos. | 9 | 3 | 90 | `04-separador-magnetico` |
| `05 \| Filtro de banda` | Etapa F02: sólidos — filtro de banda / papel / gravedad. | 10 | 3 | 90 | `05-filtro-banda` |
| `06 \| Skimmer aceite` | Etapa F03: aceite atrapado — skimmer / coalescente / desnatador. | 11 | 4 | 80 | `06-skimmer-aceite` |
| `07 \| Síntoma (test)` | TEST — búsquedas del síntoma. Solo frase, puja baja; pausar si no trae leads. | 11 | 0 | 50 | `07-sintoma-test` |

### 3.4 Grupos — PT (BR)

| Grupo | Intención | Frase | Exacta | Índice de puja | utm_content |
|---|---|---|---|---|---|
| `01 \| Conformação tubos` | Aplicação: formadoras ERW / HFW, perfiladeiras, trefilação. | 12 | 3 | 130 | `01-conformacao-tubos` |
| `02 \| Fluido de corte` | Categoria: filtragem de fluido de corte / óleo solúvel / emulsão. | 10 | 4 | 100 | `02-fluido-de-corte` |
| `03 \| Central de filtragem` | Sistema completo: central / filtragem centralizada. | 6 | 2 | 120 | `03-central-filtragem` |
| `04 \| Separador magnético` | Etapa F01: finos ferrosos. | 6 | 2 | 90 | `04-separador-magnetico` |
| `05 \| Filtro de papel` | Etapa F02: sólidos — filtro de papel / esteira / depurador a tecido. | 7 | 3 | 90 | `05-filtro-papel` |
| `06 \| Skimmer óleo` | Etapa F03: óleo tramp — skimmer / coalescente. | 11 | 3 | 80 | `06-skimmer-oleo` |
| `07 \| Sintoma (teste)` | TESTE — buscas pelo sintoma. Só frase, lance baixo. | 10 | 0 | 50 | `07-sintoma-teste` |

### 3.5 Afuera, a propósito

| Qué | Por qué |
|---|---|
| Keywords de mecanizado y rectificado ("filtro de papel para rectificadora") | La landing es de conformado de tubos: esa búsqueda acá baja la relevancia y la conversión. Entran cuando haya una landing propia. |
| Keywords sueltas ambiguas: "filtro de banda", "skimmer", "refrigerante", "conformado", "formadora" | Traen electrónica, piletas, autos y formadoras de hamburguesas. Siempre con el contexto del fluido. |
| Campaña EN (`/en/conformado`) | Fase 2. El mercado en inglés (EE. UU.) tiene fabricantes locales con servicio en planta, CPC más altos, y no hay red de servicio declarada allá. Hoy la landing EN sirve para LinkedIn o contacto directo; se revisa si aparece un distribuidor. |
| España | Fase 2: otro vocabulario ("taladrina") y otro mercado. |
| Centroamérica, Puerto Rico, Venezuela | Entre diez y quince plantas en ocho países, ninguno en la lista de 14 de Trans-Fil, y volumen mínimo; en Venezuela y Puerto Rico no se verificó ninguna tubera activa. Centroamérica se trabaja por contacto directo (ACESCO Panamá, Metalco, Tubac) y se puede probar dentro de MX a las 8 semanas (mismo huso). |
| EE. UU. | Fase 2, con la campaña EN. |
| Marca ("trans-fil", "transfil") | La búsqueda de marca la resuelve el orgánico, al home. Ni keyword ni negativa. |
| Marcas de competidores | No se puja por ellas (la landing tampoco los nombra). |

### 3.6 Geo targeting por clúster

En un nicho con pocas búsquedas, el límite es la demanda, no la geografía.
Por eso cada campaña segmenta **el país entero** con "Presencia" y pone
**recargos de puja donde están las plantas**. Quien busca tampoco está
siempre en la planta: compras e ingeniería suelen estar en otra ciudad.

| Nivel | Ajuste | Cuándo |
|---|---|---|
| Núcleo | +30% | Al menos dos plantas verificadas de tubo, perfilado o trefilado, o una inversión en tubo de 2023–2026 |
| Secundario | +15% | Una sola planta, proyectos sin confirmar, sedes y compras, o la provincia alrededor de un núcleo |
| Base | 0% | El resto del país (la segmentación por país) |

- Cuando las ubicaciones se superponen, Google aplica el ajuste de la más
  específica: el país es la base y cada clúster, el recargo.
- **Solo rigen con CPC manual.** Con Maximizar conversiones (Smart
  Bidding) se ignoran; ver §9.
- **Cómo cargarlos:** en la web de Google Ads, campaña → *Ubicaciones* →
  *Búsqueda avanzada* → *Ubicaciones masivas* → pegá la columna
  "Ubicación" de [`11-ubicaciones-clusters.csv`](./conformado-search/11-ubicaciones-clusters.csv)
  → confirmá cada coincidencia → *Agregar*; después, el ajuste en la tabla
  de ubicaciones. Los IDs no se verificaron. Si un partido o municipio no
  aparece, se reemplaza por un radio de 20–30 km que cubra el área
  metropolitana.
- Se corrige con datos: el informe de **ubicaciones coincidentes** (60–90
  días acumulados, leído por estado) dice qué subir y qué bajar.

**AR**

| Nivel | Ubicación | Tipo | Plantas que lo justifican |
|---|---|---|---|
| Núcleo +30% | Campana, Buenos Aires | Partido | Tenaris Siderca (sin costura y OCTG) |
| Núcleo +30% | Zárate, Buenos Aires | Partido | Corredor Campana–Zárate |
| Núcleo +30% | San Nicolás de los Arroyos, Buenos Aires | Partido | Sidersa y obra de Sidersa+; Acindar San Nicolás |
| Núcleo +30% | Ramallo, Buenos Aires | Partido | Ternium General Savio |
| Núcleo +30% | Villa Constitución, Santa Fe | Ciudad | Acindar (trefilado) |
| Núcleo +30% | Rosario, Santa Fe | Ciudad | Acindar Rosario |
| Núcleo +30% | Pérez, Santa Fe | Ciudad | Gerdau Pérez |
| Núcleo +30% | Lanús, Buenos Aires | Partido | Tenaris SIAT (tubo con costura de gran diámetro) |
| Núcleo +30% | Tigre, Buenos Aires | Partido | TASA/Ternium El Talar (tubo y perfiles) |
| Núcleo +30% | La Matanza, Buenos Aires | Partido | Acindar La Tablada (alambre) |
| Núcleo +30% | Vicente López, Buenos Aires | Partido | Hunter Douglas Villa Martelli (perfilado) |
| Núcleo +30% | Justo Daract, San Luis | Ciudad | TASA/Ternium Justo Daract (tubo y perfiles) |
| Núcleo +30% | Villa Mercedes, San Luis | Ciudad | Acindar Villa Mercedes (clavos y alambre) |
| Secundario +15% | Provincia de Buenos Aires | Provincia | Conarco–ESAB Chascomús; trefiladores y pymes sin relevar |
| Secundario +15% | Provincia de Santa Fe | Provincia | Pymes de caño, perfil y trefilado sin relevar |
| Secundario +15% | Provincia de Córdoba | Provincia | Cercanía de servicio |
| Secundario +15% | Ciudad Autónoma de Buenos Aires | Ciudad | Sedes y compras |

**MX**

| Nivel | Ubicación | Tipo | Plantas que lo justifican |
|---|---|---|---|
| Núcleo +30% | Nuevo León | Estado | Prolamsa (Escobedo); Ternium (Monterrey y Pesquería); Tubacero; Villacero; Maquilacero; Regiomontana de Perfiles y Tubos |
| Núcleo +30% | Coahuila | Estado | Tubos Samuel; DeAcero Ramos Arizpe y Ramos II; Waelzholz; Conduit RYMCO |
| Núcleo +30% | Guanajuato | Estado | Mubea (tubo de precisión, 2025); DeAcero Celaya |
| Secundario +15% | Veracruz | Estado | Tenaris Tamsa (sin costura y roscado OCTG) |
| Secundario +15% | Ciudad de México | Estado | Ex Aceros Cuatro Caminos; Grupo Collado; sedes y compras |
| Secundario +15% | Estado de México | Estado | Ex Aceros Cuatro Caminos; sedes y compras |

**BR**

| Nivel | Ubicación | Tipo | Plantas que lo justifican |
|---|---|---|---|
| Núcleo +30% | São Paulo (estado), Brasil | Estado | Tenaris Confab; Apolo Tubulars; Aperam; Belgo Arames; pymes de tubo soldado |
| Núcleo +30% | Minas Gerais, Brasil | Estado | Vallourec Barreiro y Jeceaba; Belgo Arames; Cofer |
| Núcleo +30% | Santa Catarina, Brasil | Estado | Tuper/ArcelorMittal; Marcegaglia; Steelmast |
| Núcleo +30% | Espírito Santo, Brasil | Estado | Perfilados Rio Doce (planta nueva); TSA; Vallourec Serra |
| Secundario +15% | Rio de Janeiro (estado), Brasil | Estado | MVal (planta nueva sin confirmar); sede de Apolo |
| Secundario +15% | Rio Grande do Sul, Brasil | Estado | Panatlântica (perfilado) |
| Secundario +15% | Bahia, Brasil | Estado | Belgo Feira de Santana |

**LATAM** (cada país entra completo en base)

| Nivel | Ubicación | Tipo | Plantas que lo justifican |
|---|---|---|---|
| Núcleo +30% | Lima, Perú | Departamento | Tupemesa/Cintac; Aceros Arequipa; Precor (Chilca) |
| Núcleo +30% | Callao, Perú | Región | Aceros Arequipa (Lima–Callao) |
| Núcleo +30% | Atlántico, Colombia | Departamento | Acesco (Malambo); Corpacero; Ternium |
| Núcleo +30% | Bolívar, Colombia | Departamento | Tenaris TuboCaribe (Cartagena) |
| Núcleo +30% | Guayas, Ecuador | Provincia | IPAC (tres plantas); Novacero |
| Núcleo +30% | Región Metropolitana de Santiago, Chile | Región | Cintac; Formac; VH Acero; Hunter Douglas |
| Núcleo +30% | Central, Paraguay | Departamento | Schussmuller (planta nueva); L'Acerie; Barbieri |
| Núcleo +30% | Asunción, Paraguay | Ciudad | Gran Asunción |
| Núcleo +30% | Santa Cruz, Bolivia | Departamento | Aceros Arequipa (planta nueva) |
| Secundario +15% | Cauca, Colombia | Departamento | Ternium "Cali unit" |
| Secundario +15% | Valle del Cauca, Colombia | Departamento | Gerdau Diaco (Yumbo) |
| Secundario +15% | Cundinamarca, Colombia | Departamento | Proalco-Bekaert (Sibaté); Diaco |
| Secundario +15% | Bogotá, Colombia | Ciudad | Sedes y compras |
| Secundario +15% | Pichincha, Ecuador | Provincia | Novacero (Quito) |
| Secundario +15% | Cotopaxi, Ecuador | Provincia | Novacero (Lasso) |
| Secundario +15% | Biobío, Chile | Región | Inchalam (Talcahuano) |
| Secundario +15% | Distrito Nacional, República Dominicana | Provincia | Metaldom (línea de tubo de 60 kt/año) |
| Secundario +15% | Santo Domingo, República Dominicana | Provincia | Metaldom |

---

## 4. Palabras clave

Concordancia **de frase** y **exacta**. Sin amplia al inicio: con volumen
bajo y sin historial de conversiones, la amplia trae búsquedas que no
tienen nada que ver. Google suele ofrecer activar "concordancia amplia" a
nivel campaña: **dejala apagada**.

### 4.1 ES (AR, MX y LATAM)

Vocabulario: "soluble", "aceite soluble", "refrigerante", "emulsión",
"fluido de corte" — siempre junto a filtración o a un equipo.

| Grupo | Frase ("…") | Exacta ([…]) |
|---|---|---|
| 01 \| Conformado tubos | filtración para línea de tubos · filtrado para línea de tubos · filtración formadora de tubos · filtro para formadora de tubos · soluble formadora de tubos · refrigerante formadora de tubos · emulsión formadora de tubos · filtración línea erw · filtración tubos con costura · refrigerante tubos con costura · filtración conformado de tubos · filtración perfiladora · soluble perfiladora · filtración trefilado · filtrado emulsión trefilado | filtración formadora de tubos · filtración línea de tubos · filtración conformado de tubos · filtro para formadora de tubos |
| 02 \| Filtración soluble | filtración de refrigerante · filtrado de refrigerante · filtro de refrigerante industrial · filtración de soluble · filtrado de soluble · filtro para soluble · filtro de aceite soluble · filtrado de aceite soluble · filtración de emulsión · filtración de fluido de corte · filtro para fluido de corte · sistema de filtrado de refrigerante · tratamiento de soluble · tratamiento de refrigerante industrial · recuperación de soluble · reciclado de soluble | filtración de refrigerante · filtración de soluble · filtro para soluble · filtro de aceite soluble |
| 03 \| Central de filtrado | central de filtrado · central de filtración · filtración centralizada · filtrado centralizado · sistema de filtrado centralizado · filtración centralizada de refrigerante · central de filtrado de soluble · sistema centralizado de refrigerante · central de refrigerante · planta de filtrado de soluble | central de filtrado · central de filtración · filtración centralizada |
| 04 \| Separador magnético | separador magnético para refrigerante · separador magnético para soluble · separador magnético de tambor · separador magnético de finos · separador magnético industrial · filtro magnético para refrigerante · filtro magnético para soluble · separación magnética de refrigerante · separación magnética de soluble | separador magnético para refrigerante · separador magnético de tambor · separador magnético para soluble |
| 05 \| Filtro de banda | filtro de banda para refrigerante · filtro de banda para soluble · filtro de banda por gravedad · filtro de banda de papel · filtro de papel para refrigerante · filtro de papel para soluble · filtro de lecho de papel · filtro de gravedad para soluble · filtro de tela para soluble · filtro de papel para emulsión | filtro de banda para refrigerante · filtro de papel para soluble · filtro de banda por gravedad |
| 06 \| Skimmer aceite | skimmer de aceite · skimmer industrial · skimmer de banda · skimmer para soluble · skimmer para refrigerante · oil skimmer · separador de aceite atrapado · separador coalescente de aceite · desnatador de aceite · recuperador de aceite industrial · separador de aceite para soluble | skimmer de aceite · skimmer industrial · separador de aceite atrapado · oil skimmer |
| 07 \| Síntoma (test) | soluble con olor · olor del soluble · olor en el soluble · soluble huele mal · bacterias en el soluble · vida útil del soluble · vida útil del aceite soluble · cambio de soluble · soluble contaminado · aceite en el soluble · mantenimiento del soluble | — |

México usa además su propio léxico. Antes de lanzar, buscá en el
Planificador, con ubicación México, "tubería", "molino de tubo" y
"refrigerante soluble" junto a filtración o a un equipo (p. ej.
"filtración molino de tubo", "filtro refrigerante soluble"), y sumá como
exactas en la campaña MX las variantes que tengan volumen.

### 4.2 PT (BR)

"Fluido de corte", "óleo solúvel", "emulsão", "filtragem". **Nunca
"refrigerante"**: en Brasil es gaseosa, y "fluido refrigerante" es el gas
del aire acondicionado.

| Grupo | Frase ("…") | Exacta ([…]) |
|---|---|---|
| 01 \| Conformação tubos | filtragem para linha de tubos · filtragem conformação de tubos · filtragem formadora de tubos · filtro para formadora de tubos · fluido de corte formadora de tubos · emulsão formadora de tubos · filtragem tubos com costura · filtragem linha erw · filtragem perfiladeira · fluido de corte perfiladeira · filtragem trefilação · filtragem emulsão trefilação | filtragem para linha de tubos · filtragem conformação de tubos · filtragem formadora de tubos |
| 02 \| Fluido de corte | filtragem de fluido de corte · filtro de fluido de corte · filtro para fluido de corte · filtragem de óleo solúvel · filtro de óleo solúvel · filtragem de emulsão · tratamento de fluido de corte · recuperação de fluido de corte · reciclagem de fluido de corte · sistema de filtragem de fluido de corte | filtragem de fluido de corte · filtro para fluido de corte · filtro de fluido de corte · filtragem de óleo solúvel |
| 03 \| Central de filtragem | central de filtragem · filtragem centralizada · sistema de filtragem centralizado · sistema centralizado de fluido de corte · central de fluido de corte · central de filtragem de fluido de corte | central de filtragem · filtragem centralizada |
| 04 \| Separador magnético | separador magnético para fluido de corte · separador magnético para óleo solúvel · separador magnético de tambor · separador magnético industrial · filtro magnético para fluido de corte · separação magnética de fluido de corte | separador magnético para fluido de corte · separador magnético de tambor |
| 05 \| Filtro de papel | filtro de papel para fluido de corte · filtro de papel para óleo solúvel · filtro de manta para fluido de corte · filtro de esteira para fluido de corte · filtro por gravidade para fluido de corte · depurador a tecido · filtro de papel para emulsão | filtro de papel para fluido de corte · depurador a tecido · filtro de esteira para fluido de corte |
| 06 \| Skimmer óleo | skimmer de óleo · skimmer industrial · skimmer para fluido de corte · skimmer de esteira · skimmer de cinta · oil skimmer · remoção de óleo tramp · separador de óleo tramp · óleo tramp · separador coalescente de óleo · remoção de óleo do fluido de corte | skimmer de óleo · skimmer industrial · oil skimmer |
| 07 \| Sintoma (teste) | fluido de corte com cheiro · fluido de corte cheirando mal · fluido de corte com mau cheiro · bactéria no fluido de corte · bactérias no fluido de corte · vida útil do fluido de corte · troca de fluido de corte · óleo solúvel com cheiro · fluido de corte contaminado · óleo no fluido de corte | — |

---

## 5. Negativas

Todas en concordancia de frase. Van con y sin tilde (y en plural cuando
hace falta) porque las negativas no cubren variantes.

Ojo con tres palabras que en planta son legítimas y por eso van **solo a
nivel grupo**: "pileta" (es el tanque de la máquina: "filtro para pileta
de soluble" es un cliente) y "estanque" (tanque, en Chile) solo en el
grupo 06; "agua" solo en el grupo 03.

Validado: ninguna negativa bloquea una keyword propia.

### 5.1 ES — nivel campaña (AR, MX y LATAM)

| Tema | Términos (concordancia de frase) |
|---|---|
| Empleo | trabajo · trabajos · empleo · empleos · cv · curriculum · currículum · sueldo · sueldos · salario · vacante · vacantes · pasantía · pasantia · pasantías · computrabajo · bumeran · zonajobs · linkedin · job · jobs |
| Información / educación | pdf · tesis · monografía · monografia · qué es · que es · definición · definicion · significado · curso · cursos · tutorial · wikipedia · apunte · apuntes · ppt · diapositivas |
| Hágalo usted mismo | casero · casera · cómo hacer · como hacer · diy |
| Marketplace / usados | mercadolibre · mercado libre · usado · usados · usada · segunda mano · alquiler · gratis · olx · amazon · aliexpress · alibaba · temu |
| Auto, refrigerante de motor y refrigeración doméstica | auto · autos · coche · carro · car · camioneta · moto · motos · motor · radiador · anticongelante · líquido refrigerante · liquido refrigerante · paraflu · prestone · heladera · aire acondicionado · gas refrigerante · r134a · r410 · r22 · freezer · fram · mann · wega · bosch |
| Piscina / acuario (skimmer) | piscina · piscinas · pileta de natación · pelopincho · intex · bestway · vulcano · acuario · pecera · spa · jacuzzi |
| Skimmer de tarjetas / trading | tarjeta · tarjetas · cajero · clonar · clonador · trading · forex · lectura |
| Formadoras de alimentos / construcción | hamburguesa · hamburguesas · empanada · empanadas · milanesa · milanesas · ladrillo · ladrillos · bloque · bloques · adoquín · adoquines · pasta · pastas |
| Tubos fuera de rubro | led · fluorescente · ensayo · oxígeno · oxigeno · neón · neon · cartón · carton · pvc |
| Soluble alimenticio | café · cafe · nescafé · nescafe · fibra · vitamina · cacao · leche |
| Emulsión fuera de rubro | asfáltica · asfaltica · asfalto · crema · piel · cosmética · cosmetica · fotográfica · fotografica · serigrafía · serigrafia |
| Cocina / grasas | cocina · restaurante · trampa de grasa · aceite usado · freidora |
| Separador de hidrocarburos | hidrocarburos · lavadero · estación de servicio · estacion de servicio · pluvial |
| Calefacción / combustible | caldera · calefacción · calefaccion · combustible · aire comprimido · gasoil · diésel · diesel |
| Tratamiento de agua | agua potable · agua de pozo · tratamiento de agua · ósmosis · osmosis · purificador · ablandador · cloro |

### 5.2 ES — nivel grupo

| Grupo | Negativas propias (frase) |
|---|---|
| 03 \| Central de filtrado | agua · aire · humo · humos · polvo · refrigeración · refrigeracion · frío · frio |
| 04 \| Separador magnético | minería · mineria · mineral · minerales · arena · áridos · aridos · reciclaje · residuos · chatarra · harina · granos · cereales · alimentos · plástico · plastico · neodimio · imanes · cinta transportadora · overband · polea |
| 05 \| Filtro de banda | pasa banda · pasabanda · paso banda · banda ancha · audio · señal · senal · ecualizador · arduino · circuito · radio · frecuencia · rf · prensa · lodos · deshidratación · deshidratacion · cafetera |
| 06 \| Skimmer aceite | pileta · piletas · estanque · laguna · pool · derrame · derrames · marino · barco |

### 5.3 PT — nivel campaña

| Tema | Términos (concordancia de frase) |
|---|---|
| Emprego | emprego · empregos · vaga · vagas · salário · salario · trabalhe conosco · currículo · curriculo · estágio · estagio · catho · indeed · infojobs · linkedin · job · jobs |
| Informação / educação | pdf · tcc · monografia · apostila · o que é · o que e · definição · definicao · significado · curso · cursos · tutorial · wikipedia · senai · ppt · slides |
| Faça você mesmo | caseiro · caseira · como fazer · faça você mesmo · faca voce mesmo · diy |
| Marketplace / usados | mercado livre · mercadolivre · usado · usados · usada · seminovo · aluguel · locação · locacao · grátis · gratis · olx · amazon · aliexpress · shopee · temu |
| Refrigerante = bebida | coca · coca-cola · guaraná · guarana · lata · pet · zero · bebida · bebidas · refri |
| Auto e ar-condicionado | carro · carros · car · moto · motos · motor · radiador · aditivo para radiador · anticongelante · automotivo · ar condicionado · ar-condicionado · geladeira · freezer · gás refrigerante · gas refrigerante · r410a · r22 · r134a · split · fram · mann · wega · tecfil · bosch |
| Piscina / aquário (skimmer) | piscina · piscinas · aquário · aquario · lago · spa · hidromassagem · sodramar · nautilus · pool |
| Skimmer de cartão / trading | cartão · cartao · caixa eletrônico · caixa eletronico · clonagem · clonar · chupa-cabra · chupa cabra · trading · forex |
| Formadoras de alimentos / construção | hambúrguer · hamburguer · salgado · salgados · coxinha · nhoque · tijolo · tijolos · bloco de concreto · paver · pavers |
| Tubos fora do ramo | led · fluorescente · ensaio · oxigênio · oxigenio · neon · papelão · papelao · pvc |
| Café / alimentos | café · cafe · coador · cafeteira · nescafé · nescafe · fibra · vitamina · cacau · leite |
| Emulsão fora do ramo | asfáltica · asfaltica · asfalto · cosmético · cosmetico · creme · pele · fotográfica · fotografica · serigrafia |
| Cozinha / gordura | cozinha · restaurante · caixa de gordura · óleo de cozinha · oleo de cozinha · fritadeira |
| Separador água e óleo / combustível | caixa separadora · caixa sao · separador de água e óleo · separador agua e oleo · lava jato · lava-jato · lava rápido · lava rapido · posto de combustível · posto de gasolina · combustível · combustivel · diesel · gasolina · ar comprimido · compressor |
| Aquecimento | caldeira · aquecimento · aquecedor |
| Tratamento de água | água potável · agua potavel · poço · poco · osmose · purificador · filtro de água · filtro de agua · cloro |

### 5.4 PT — nivel grupo

| Grupo | Negativas propias (frase) |
|---|---|
| 03 \| Central de filtragem | ar · água · agua · fumaça · fumaca · poeira · refrigeração · refrigeracao |
| 04 \| Separador magnético | mineração · mineracao · minério · minerio · areia · reciclagem · resíduos · residuos · sucata · farinha · grãos · graos · plástico · plastico · alimentos · neodímio · neodimio · ímãs · imas · correia transportadora · overband |
| 05 \| Filtro de papel | passa banda · passa-banda · passa faixa · áudio · audio · sinal · equalizador · arduino · circuito · rádio · radio · frequência · frequencia · rf · prensa · lodo · desaguamento |
| 06 \| Skimmer óleo | peixe · peixes · derramamento · mar · mancha · manchas · piso · tecido · roupa |

AR, MX y LATAM comparten las negativas de campaña. Si preferís, armá una
**lista de negativas compartida** en la Biblioteca compartida y aplicala a
las tres.

---

## 6. Anuncios (RSA)

Un anuncio de búsqueda responsivo por grupo: 15 títulos (≤ 30 caracteres)
y 4 descripciones (≤ 90).

Reglas:

- Tono de usted, igual que la landing ("Solicite un relevamiento").
- Solo lo que la landing respalda: 2 a 4 veces la vida del refrigerante y
  50 a 70% menos recambio (siempre como **rango típico**), fabricación
  propia en Córdoba, desde 1989, 120+ clientes en 14 países, respuesta en
  24 h hábiles, relevamiento antes de cotizar, adaptación de la pileta
  existente, repuestos sin importación (**solo AR**), equipos de los 90 en
  operación.
- Sin superlativos sin prueba, sin "!" en títulos, sin competidores.
- Sin símbolos especiales: "x2 a x4" y "50 a 70%" en lugar de "×" o "−",
  que las políticas pueden marcar.
- Fijación: 2–3 títulos con el término del grupo, fijados en la posición 1
  (rotan entre sí). El resto, libre.

### 6.1 ES — títulos compartidos

| Título | Car. | Usado en |
|---|---|---|
| Menos scrap en la línea | 23 | 01 |
| Relevamiento en planta | 22 | 01, 02, 03, 04, 05, 06, 07 |
| Solicite un relevamiento | 24 | 01, 02, 03, 04, 05, 06, 07 |
| Fabricación propia en Córdoba | 29 | 01, 02, 03, 04, 05, 06, 07 |
| Respuesta en 24 h hábiles | 25 | 01, 02, 03, 04, 05, 06, 07 |
| Vida útil del soluble x2 a x4 | 29 | 01, 02, 03, 04, 05, 06, 07 |
| Más vida para el herramental | 28 | 01, 02, 04, 07 |
| Adaptamos su pileta actual | 26 | 01, 02, 03, 05, 06 |
| Líneas ERW, HFW y perfilado | 27 | 01 |
| Repuestos sin importación | 25 | 01, 02, 03, 04, 05, 06, 07 |
| Fabricante desde 1989 | 21 | 01, 03, 04, 05, 06, 07 |
| Menos recambio de soluble | 25 | 02, 04, 05, 06, 07 |
| 120+ clientes en 14 países | 26 | 02 |
| Un solo interlocutor técnico | 28 | 03 |
| Equipos de los 90 en operación | 30 | 03 |
| Consulte a un asesor técnico | 28 | 04, 05, 06, 07 |

### 6.2 ES — por grupo

| Grupo | Ruta | Títulos propios (P1 = fijado en posición 1) | Descripción propia |
|---|---|---|---|
| 01 \| Conformado tubos | /Conformado/Tubos | P1 Filtración para línea de tubos (30) · P1 Filtración para formadoras (26) · Soluble limpio en la formadora (30) · Proteja rodillos y matrices (27) | El fluido contaminado desgasta rodillos y matrices. Filtración para líneas ERW y HFW. (85) |
| 02 \| Filtración soluble | /Conformado/Soluble | P1 Filtración de soluble (21) · P1 Filtración de refrigerante (26) · P1 Filtrado de aceite soluble (26) · Tratamiento de soluble (22) · Fluido de corte limpio (22) | El soluble sucio desgasta el herramental. Filtración y recuperación de aceite a medida. (87) |
| 03 \| Central de filtrado | /Conformado/Central | P1 Central de filtrado a medida (28) · P1 Filtración centralizada (23) · Caudal y temperatura estables (29) · Bombeo, filtrado y temperado (28) · Alimenta toda la línea (22) | Bombeo, filtrado y temperado para toda la línea, con alarmas de presión y nivel. (80) |
| 04 \| Separador magnético | /Conformado/Separador | P1 Separador magnético (19) · P1 Separador magnético de tambor (29) · Retira los finos ferrosos (25) · Mejor acabado del tubo (22) · Protege la tela filtrante (25) | Tambores y barras imantadas retiran los finos ferrosos antes del filtro principal. (82) |
| 05 \| Filtro de banda | /Conformado/Filtro-banda | P1 Filtro de banda por gravedad (28) · P1 Filtro de papel para soluble (28) · Residuo seco y rebobinado (25) · Avance automático de tela (25) · Bajo costo operativo (20) | Filtración por gravedad con tela de papel o textil y avance automático según nivel. (83) |
| 06 \| Skimmer aceite | /Conformado/Skimmer | P1 Skimmer de aceite industrial (28) · P1 Separador de aceite atrapado (28) · Retire el aceite del soluble (28) · Menos olor y caída de pH (24) · Skimmer de banda y coalescente (30) | Skimmers de banda y separadores coalescentes que retiran el aceite atrapado. (76) |
| 07 \| Síntoma (test) | /Conformado/Soluble | P1 ¿Soluble con olor? (18) · P1 ¿El soluble dura poco? (22) · Aceite atrapado en el soluble (29) · Alargue la vida del soluble (27) · Menos olor y caída de pH (24) | Separamos finos, sólidos y aceite atrapado para que el soluble dure más. (72) |

| Descripción compartida | Car. | Usada en |
|---|---|---|
| Relevamiento en planta antes de cotizar. Un asesor técnico responde en 24 h hábiles. | 84 | 01, 02, 03, 04, 05, 06, 07 |
| Rangos típicos: vida del refrigerante 2 a 4 veces mayor y 50 a 70% menos recambio. | 82 | 01, 02, 06, 07 |
| Fabricación propia en Córdoba desde 1989. Repuestos sin plazos de importación. | 78 | 01, 02, 03, 04, 05, 06, 07 |
| Adaptamos la pileta existente o dimensionamos la central según el caudal de la línea. | 85 | 03, 05 |
| Separación magnética, filtro de banda y skimmer integrados en una central a medida. | 83 | 04 |

Diferencias de MX y LATAM (todo lo demás es igual a AR):

| Elemento | AR | MX y LATAM |
|---|---|---|
| Título | Repuestos sin importación | Servicio en la región |
| Descripción de confianza | Fabricación propia en Córdoba desde 1989. Repuestos sin plazos de importación. | Fabricación propia en Córdoba, Argentina, desde 1989. Clientes en 14 países. |
| Sitelink "Por qué Trans-Fil", línea 2 | Repuestos sin importación | Servicio en la región |
| Texto destacado | Repuestos sin importación | — (se quita) |

### 6.3 PT — títulos compartidos

| Título | Car. | Usado en |
|---|---|---|
| Menos sucata na linha | 21 | 01 |
| Levantamento em planta | 22 | 01, 02, 03, 04, 05, 06, 07 |
| Solicite um levantamento | 24 | 01, 02, 03, 04, 05, 06, 07 |
| Fabricação própria em Córdoba | 29 | 01, 02, 03, 04, 05, 06, 07 |
| Resposta em 24 h úteis | 22 | 01, 02, 03, 04, 05, 06, 07 |
| Vida útil do fluido x2 a x4 | 27 | 01, 02, 03, 04, 05, 06, 07 |
| Mais vida para o ferramental | 28 | 01, 02, 04, 07 |
| Aproveitamos o seu tanque | 25 | 01, 02, 03, 05, 06 |
| Linhas ERW, HFW e perfilação | 28 | 01 |
| Serviço na região | 17 | 01, 02, 03, 04, 06, 07 |
| Fabricante desde 1989 | 21 | 01, 03, 04, 05, 06, 07 |
| Menos trocas de fluido | 22 | 02, 04, 05, 06, 07 |
| 120+ clientes em 14 países | 26 | 02 |
| Um único interlocutor técnico | 29 | 03 |
| Equipamentos de 1990 operando | 29 | 03 |
| Fale com um consultor técnico | 29 | 04, 05, 06, 07 |

### 6.4 PT — por grupo

| Grupo | Ruta | Títulos propios (P1 = fijado en posición 1) | Descripción propia |
|---|---|---|---|
| 01 \| Conformação tubos | /Conformação/Tubos | P1 Filtragem para linha de tubos (29) · P1 Filtragem para conformação (26) · Fluido limpo na formadora (25) · Proteja roletes e matrizes (26) | O fluido contaminado desgasta roletes e matrizes. Filtragem para linhas ERW e HFW. (82) |
| 02 \| Fluido de corte | /Conformação/Fluido-de-corte | P1 Filtragem de fluido de corte (28) · P1 Filtragem de óleo solúvel (25) · P1 Filtro para fluido de corte (27) · Tratamento de fluido de corte (29) · Emulsão limpa na linha (22) | Fluido de corte sujo desgasta o ferramental. Filtragem e remoção de óleo sob medida. (84) |
| 03 \| Central de filtragem | /Conformação/Central | P1 Central de filtragem (20) · P1 Filtragem centralizada (22) · Vazão e temperatura estáveis (28) · Bombeamento e filtragem (23) · Alimenta a linha inteira (24) | Bombeamento, filtragem e controle de temperatura para a linha inteira, com alarmes. (83) |
| 04 \| Separador magnético | /Conformação/Separador | P1 Separador magnético (19) · P1 Separador magnético de tambor (29) · Remove os finos ferrosos (24) · Melhor acabamento do tubo (25) · Protege a manta filtrante (25) | Tambores e barras magnéticas removem os finos ferrosos antes do filtro principal. (81) |
| 05 \| Filtro de papel | /Conformação/Filtro-papel | P1 Filtro de papel por gravidade (29) · P1 Filtro de esteira sob medida (28) · Depurador a tecido (18) · Resíduo seco e rebobinado (25) · Avanço automático da manta (26) · Baixo custo operacional (23) | Filtragem por gravidade com manta de papel ou têxtil e avanço automático por nível. (83) |
| 06 \| Skimmer óleo | /Conformação/Skimmer | P1 Skimmer de óleo industrial (26) · P1 Remoção de óleo tramp (21) · Retire o óleo do fluido (23) · Menos odor e queda de pH (24) · Skimmers e coalescentes (23) | Skimmers de esteira e separadores coalescentes que retiram o óleo tramp do fluido. (82) |
| 07 \| Sintoma (teste) | /Conformação/Fluido | P1 Fluido de corte com cheiro? (27) · P1 O fluido dura pouco? (20) · Óleo tramp no fluido de corte (29) · Prolongue a vida do fluido (26) · Menos odor e queda de pH (24) | Separamos finos, sólidos e óleo tramp para o fluido de corte durar mais. (72) |

| Descripción compartida | Car. | Usada en |
|---|---|---|
| Levantamento em planta antes da proposta. Um consultor técnico responde em 24 h úteis. | 86 | 01, 02, 03, 04, 05, 06, 07 |
| Faixas típicas: vida do fluido 2 a 4 vezes maior e 50 a 70% menos trocas. | 73 | 01, 02, 06, 07 |
| Fabricação própria em Córdoba, Argentina, desde 1989. Clientes em 14 países. | 76 | 01, 02, 03, 04, 05, 06, 07 |
| Mantemos o tanque existente ou dimensionamos a central conforme a vazão da linha. | 81 | 03, 05 |
| Separação magnética, filtro de esteira e skimmer integrados em uma central sob medida. | 86 | 04 |

---

## 7. Recursos

### 7.1 Sitelinks

Apuntan a las anclas de la landing (los `id` de `LandingLayout.astro`, que
son iguales en los tres idiomas).

ES (AR; en MX y LATAM cambia la línea 2 de "Por qué Trans-Fil", §6.2):

| Texto | Línea 1 | Línea 2 | URL |
|---|---|---|---|
| Solicitar relevamiento | Visita técnica a su planta | Respuesta en 24 h hábiles | `/conformado#contacto` |
| Cómo funciona el sistema | Magnético, banda y skimmer | Integrados en una central | `/conformado#sistema` |
| Por qué Trans-Fil | Fabricación propia en Córdoba | Repuestos sin importación | `/conformado#por-que` |
| Clientes y antecedentes | Siderurgia, tubos y automotriz | Más de 120 clientes | `/conformado#antecedentes` |
| Consultas frecuentes | Adaptación de pileta existente | Resultados y plazos típicos | `/conformado#faq` |
| El problema del soluble | Finos y aceite atrapado | desgastan el herramental | `/conformado#problema` |

PT:

| Texto | Línea 1 | Línea 2 | URL |
|---|---|---|---|
| Solicitar levantamento | Visita técnica à sua planta | Resposta em 24 h úteis | `/pt/conformado#contacto` |
| Como funciona o sistema | Magnético, esteira e skimmer | Integrados em uma central | `/pt/conformado#sistema` |
| Por que a Trans-Fil | Fabricação própria em Córdoba | Serviço na região | `/pt/conformado#por-que` |
| Clientes e histórico | Siderurgia, tubos e automotivo | Mais de 120 clientes | `/pt/conformado#antecedentes` |
| Dúvidas frequentes | Adaptação do tanque existente | Resultados e prazos típicos | `/pt/conformado#faq` |
| O problema do fluido | Finos e óleo tramp | desgastam o ferramental | `/pt/conformado#problema` |

Apenas salgan los anuncios (antes de activar no hay anuncio que
clickear), hacé un clic de prueba en un sitelink y fijate que el `gclid`
y las UTM queden **antes** del `#` (`/conformado?utm_source=…#sistema`).
Si quedan después, el formulario no las lee (las toma de
`location.search`) y el mail a ventas llega sin origen: en ese caso se
resuelve en la landing, no en la campaña.

### 7.2 Textos destacados

ES (AR): `Fabricación propia` · `Relevamiento en planta` · `Respuesta en 24 h hábiles` · `Adaptamos su pileta` · `Repuestos sin importación` · `Desde 1989 en Córdoba` · `Clientes en 14 países` · `Ingeniería a medida` · `Un solo interlocutor` · `Servicio en la región`

MX y LATAM: los mismos, sin "Repuestos sin importación".

PT: `Fabricação própria` · `Levantamento em planta` · `Resposta em 24 h úteis` · `Aproveitamos seu tanque` · `Desde 1989 em Córdoba` · `Clientes em 14 países` · `Engenharia sob medida` · `Um único interlocutor` · `Serviço na região`

### 7.3 Fragmentos estructurados

| Campaña | Encabezado | Valores |
|---|---|---|
| ES (AR, MX y LATAM) | Tipos (Types) | Separador magnético · Filtro de banda · Skimmer de aceite · Central de filtrado · Filtro bolsa · Intercambiador de calor |
| ES (AR, MX y LATAM) | Servicios (Service catalog) | Relevamiento en planta · Ingeniería a medida · Retrofitting · Mantenimiento · Repuestos |
| PT (BR) | Tipos (Types) | Separador magnético · Filtro de esteira · Skimmer de óleo · Central de filtragem · Filtro de saco · Trocador de calor |
| PT (BR) | Serviços (Service catalog) | Levantamento em planta · Engenharia sob medida · Retrofit · Manutenção · Peças de reposição |

### 7.4 Llamada

Solo AR, en horario comercial: **+54 9 351 382-0321** (la misma línea de
WhatsApp de ventas). Si Google ofrece número de desvío en Argentina,
activá los informes de llamadas y creá "Llamada desde anuncio" (≥ 60 s)
como conversión secundaria. Pendiente de confirmar (§13).

### 7.5 Imágenes, nombre del negocio y logo

Fotos reales del repo — nada de stock:

| Archivo | Tamaño | Notas |
|---|---|---|
| `public/img/t02-magnetic-separator-poster.webp` | 1280×720 | Separador magnético (F01) |
| `public/img/t02-band-filters.webp` | 1344×768 | Filtro de banda (F02) |
| `public/img/t02-oil-recovery.webp` | 1600×1200 | Skimmer (F03) |
| `public/img/t03-fluids-cover.webp` | 1800×900 | Central completa (F04) |
| `public/img/hero-coolant-poster.webp` | 1024×540 | Sirve, pero queda debajo de los 1200×628 recomendados |

- Google Ads acepta JPG, PNG y GIF: exportá el WebP antes de subir.
- Recortá en el editor de Google Ads a **1,91:1** (mín. 600×314) y **1:1**
  (mín. 300×300). Todas dan para los dos recortes.
- Nombre del negocio: **Trans-Fil**. Logo: `public/img/logo-mark.png`
  (265×220 → recorte 1:1 de 220×220; pasa el mínimo de 128×128, pero si hay
  un archivo cuadrado más grande, mejor).
- Google muestra imágenes en Search solo en cuentas que cumplen sus
  requisitos de antigüedad e historial: si no aparecen al principio, es
  por eso.

### 7.6 Qué no usar

- **Formulario de clientes potenciales de Google:** en B2B trae leads de un
  clic, sin contexto. El formulario de la landing pide tipo de línea y
  fluido, que es lo que ventas necesita.
- **Recursos de texto creados automáticamente:** apagados (pueden escribir
  afirmaciones que la landing no respalda). Las imágenes automáticas
  tomadas de la landing pueden quedar: son fotos reales.

---

## 8. Configuración de campaña

| Ajuste | Valor | Por qué |
|---|---|---|
| Tipo / objetivo | Búsqueda · Clientes potenciales | |
| Redes | Solo Búsqueda de Google. **Sin Display, sin socios de búsqueda** al inicio | Socios se prueba después de la semana 6 si falta volumen |
| AI Max para Search | **Apagado.** Viene activado por defecto en campañas nuevas ([ayuda de Google](https://support.google.com/google-ads/answer/15910187)). Como mínimo: expansión de URL final y personalización de texto apagadas | La expansión de URL mandaría tráfico al home; la personalización escribe textos con afirmaciones no aprobadas. Además, desde septiembre de 2026 Google pasa solas a AI Max las campañas con recursos de texto automáticos o con concordancia amplia a nivel campaña ([Google](https://blog.google/products/ads-commerce/dsa-upgrade-to-ai-max-2026/)): por eso esos dos ajustes también van apagados |
| Concordancia amplia a nivel campaña | Apagada | §4 |
| Ubicación | País entero con **Presencia** ("personas que están o suelen estar en", no "interés") + recargos por clúster (§3.6) | Afuera quedan estudiantes y curiosos de otros países; la prioridad la marcan los recargos |
| Idioma | No se configura: Google lo quitó de Search a fines de septiembre de 2026 | Decide el idioma del anuncio, de la landing y de la consulta. Cada campaña tiene todo en un solo idioma y BR no comparte países con las de español |
| Horario | §0 (hora de la cuenta) | Se revisa a las 8–12 semanas, con datos |
| Dispositivos | Todos, sin ajustes | Se revisa a las 8–12 semanas |
| Rotación de anuncios | Optimizar | |
| Objetivos de conversión | De campaña: solo "Lead – Formulario" y "Lead – WhatsApp" | Que no puje por conversiones secundarias |
| Anuncios políticos de la UE | "No" (si lo pide) | |
| Estado inicial | En pausa | Se activa al terminar el §11 |

---

## 9. Puja y presupuesto

**Semanas 1–4: CPC manual.** Permite pujar más en los grupos de alta
intención (01, 03) y poco en el test (07). Maximizar clics busca clics
baratos, que en este nicho suelen ser los irrelevantes. (El CPC avanzado ya
no existe.) Si no hay tiempo para mantener pujas manuales: Maximizar clics
con límite de CPC máximo = puja base.

**Sostener el CPC manual.** Es la única modalidad en la que rigen los
recargos por clúster (§3.6) y por horario. Pasar una campaña a
**Maximizar conversiones** recién con **~30 conversiones primarias en 30
días**, sabiendo que apaga la prioridad geográfica; mientras tanto, cargar
"Lead calificado" por importación offline (§2.3). Si después se fija un CPA
objetivo: desde el 17 de agosto de 2026, las campañas limitadas por
presupuesto acercan el costo real al objetivo, así que un objetivo holgado
encarece el lead.

Pujas por grupo, como índice (100 = puja base). Puja base = CPC "parte
superior de la página (rango alto)" que da el Planificador para las
keywords del grupo 02 en ese mercado.

| Grupo ES | Grupo PT | Índice |
|---|---|---|
| 01 \| Conformado tubos | 01 \| Conformação tubos | 130 |
| 02 \| Filtración soluble | 02 \| Fluido de corte | 100 |
| 03 \| Central de filtrado | 03 \| Central de filtragem | 120 |
| 04 \| Separador magnético | 04 \| Separador magnético | 90 |
| 05 \| Filtro de banda | 05 \| Filtro de papel | 90 |
| 06 \| Skimmer aceite | 06 \| Skimmer óleo | 80 |
| 07 \| Síntoma (test) | 07 \| Sintoma (teste) | 50 |

Presupuesto diario = **clics por día buscados × CPC estimado**. Punto de
partida, **a validar en el Planificador antes de lanzar** (no tuvimos
acceso): AR USD 6/día, MX USD 9/día, LATAM USD 6/día, BR USD 9/día — USD
30/día, unos USD 900/mes entre las cuatro. México y Brasil, los dos
mercados grandes, llevan la mayor parte; Argentina baja porque buena parte
de su capacidad grande ya es cliente y la campaña apunta a pymes, y es la
primera en recibir más si aparece "limitada por presupuesto" con términos
limpios.

- Si la cuenta factura en ARS, convertí al cargar: los CSV no traen
  montos a propósito.
- Lo más probable es que el volumen no alcance a gastar el presupuesto. No
  es un problema de la campaña, es el tamaño del nicho.

---

## 10. Tracking (UTM)

Etiquetado automático (`gclid`) + **sufijo de URL final** con UTM
legibles. El sufijo del grupo **reemplaza** al de la campaña (no se
suman), por eso cada grupo lleva la cadena completa:

```
utm_source=google&utm_medium=cpc&utm_campaign=conformado_search_ar_es&utm_content=01-conformado-tubos&utm_term={keyword}
```

- El sufijo de campaña es el mismo sin `utm_content`; queda de respaldo.
- `{keyword}` lo completa Google con la keyword que activó el anuncio.
- El formulario ya reenvía `utm_term`, `utm_content` y `gclid` en el mail a
  ventas@ ([`LANDINGS.md`](../LANDINGS.md) §6): **ventas ve la keyword y el
  grupo que trajeron cada lead** sin entrar a Google Ads.
- GA4 atribuye los clics de Google Ads por el `gclid`; las UTM son para el
  mail y de respaldo.

---

## 11. Checklist de lanzamiento

- [ ] `/conformado` y `/pt/conformado` en producción, con su canonical.
- [ ] Acciones de conversión creadas (§2.1) y tags de GTM publicados;
      prueba con Vista previa OK.
- [ ] Etiquetado automático activado.
- [ ] CSV importados en Editor en orden ([README](./conformado-search/README.md)),
      vista previa revisada.
- [ ] Planificador de palabras clave: volumen y CPC por mercado (puja base,
      §9) y léxico de México (§4.1).
- [ ] Presupuestos y Max CPC por grupo cargados (§9). Publicar desde Editor.
- [ ] Ubicaciones de clúster cargadas con su ajuste en cada campaña (§3.6).
- [ ] En la web de Google Ads, en cada campaña: AI Max apagado,
      concordancia amplia apagada, ubicación "Presencia", Display y socios
      apagados, recursos de texto automáticos apagados.
- [ ] Objetivos de conversión de campaña: solo las dos primarias.
- [ ] Recursos: sitelinks, textos destacados, fragmentos, nombre del
      negocio, logo, imágenes; llamada en AR si se confirma.
- [ ] Anuncios y recursos aprobados (estado de políticas).
- [ ] Verificador de URL de Google Ads OK.
- [ ] Avisarle a ventas: los mails de la campaña llegan con asunto
      `[Conformado][es] …` o `[Conformado][pt] …` y traen la keyword.
- [ ] Activar las campañas.
- [ ] Apenas salgan los anuncios: clic de prueba en un sitelink (§7.1).

---

## 12. Optimización — semanas 1 a 8

| Semana | Qué hacer |
|---|---|
| 1–2 | Informe de términos de búsqueda **dos veces por semana** (lunes y jueves). Lo irrelevante va a negativas: de campaña si es un tema, de grupo si es un cruce entre grupos. Lo bueno que no es keyword entra como exacta. Confirmar que los mails llegan con `utm_term` y que las conversiones registran. |
| 3–4 | Términos de búsqueda una vez por semana. Pausar keywords sin impresiones o marcadas "Volumen de búsqueda bajo". Si un término cae en el grupo equivocado: exacta en el correcto + negativa exacta en el otro. Revisar el Nivel de calidad por componente (CTR esperado, relevancia del anuncio, experiencia en la página de destino). Ajustar pujas con el índice. |
| 5–6 | Grupo 07: si trae clics y no leads, pausarlo. Revisar el rendimiento de los recursos de cada RSA y reemplazar los títulos "Bajos". Con ~30 conversiones / 30 días en una campaña, evaluar Maximizar conversiones (apaga los recargos geográficos). Probar socios de búsqueda si falta volumen. |
| 7–8 | Leads calificados (§2.3) por keyword y por mercado: mover presupuesto al mercado con mejor costo por lead calificado. Fijar el CPL objetivo. Si el volumen se agotó: landing propia para mecanizado / rectificado, o la campaña EN. Si MX no gasta su presupuesto: probar Guatemala, El Salvador y Costa Rica dentro de MX. |
| 9–12 | Informe de ubicaciones coincidentes, por estado y con 60–90 días acumulados: lo que trae clics y nunca leads baja a base o se excluye; un estado en base que trae leads sube a secundario. Revisar horario y dispositivos con datos. |

Regla: **un cambio grande por semana** (puja, presupuesto o estructura).
Con poco volumen, si se cambia todo junto no se sabe qué funcionó.

---

## 13. Supuestos y pendientes

| Tema | Supuesto en este plan | Confirmar |
|---|---|---|
| Presupuesto y moneda | USD 6 (AR) / 9 (MX) / 6 (LATAM) / 9 (BR) por día; montos fuera de los CSV | Monto real y moneda de la cuenta (ARS o USD); la moneda no se puede cambiar después |
| Mercados | AR + MX + LATAM (8 países, con República Dominicana) + BR; Centroamérica por contacto directo; EN y España en fase 2 | ¿Algún país más? |
| Ubicaciones de clúster | Nombres de estados, provincias y ciudades sin ID verificado | Confirmar cada coincidencia al cargarlas (§3.6) |
| Idioma | Google quitó el idioma de Search (sep-2026) | — |
| Llamada | Recurso de llamada solo en AR | ¿Se quiere que entren llamadas al +54 9 351 382-0321? |
| Valores de conversión | Relativos (formulario 1, WhatsApp 0,5) | Valor real de un lead y de un lead calificado |
| Zona horaria de la cuenta | Argentina (UTC−3) | Que la cuenta esté en esa zona |
| Volumen y CPC | Sin datos del Planificador | Validar keywords y CPC antes de lanzar |
| Importación en Editor | Encabezados como los exporta Editor; no probados contra una cuenta real | Revisar la vista previa al importar |
