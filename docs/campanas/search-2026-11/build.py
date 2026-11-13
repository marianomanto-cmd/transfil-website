"""Arma las campañas de Search (conformado + mecanizado) como payloads JSON.

Conformado sale de los CSV de ../conformado-search/ (keywords, negativas,
anuncios, recursos), con dos cambios: en AR y BR quedan solo los grupos
propios de tubos (01, 03, 07) porque los grupos de etapa genéricos pasan a
las campañas de mecanizado, y se reemplaza "Servicio en la región" por algo
verificable. Mecanizado está escrito acá.
"""
import csv, json, os, collections
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'conformado-search')
OUT = os.path.join(HERE, 'payloads')
os.makedirs(OUT, exist_ok=True)
rd = lambda f: list(csv.DictReader(open(os.path.join(SRC, f), encoding='utf-8')))
KW, NEG_C, NEG_G, ADS, SL, CO, SN = (rd(f) for f in ['04-keywords.csv', '05-negativas-campana.csv', '06-negativas-grupo.csv', '07-anuncios.csv', '08-sitelinks.csv', '09-textos-destacados.csv', '10-fragmentos.csv'])
mk = lambda c: c.split('|')[3].strip()

REPL = {
    'MX': {'Servicio en la región': 'Proyectos en México'},
    'LATAM': {'Servicio en la región': 'Proyectos en Chile y Perú'},
    'BR': {'Serviço na região': 'Projetos no Brasil'},
    'AR': {},
}
SCHED = {
    # Lunes a viernes, 8 a 18 h de cada país, expresado en hora de la cuenta (Argentina).
    'AR': [(d, 8, 18) for d in ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']],
    'BR': [(d, 8, 18) for d in ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']],
    'MX': [(d, 11, 21) for d in ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']],
    'LATAM': [(d, 8, 20) for d in ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']],
}
# Brasil: solo ciudades con polos industriales o plantas de empresas grandes (IDs de Google Ads).
BR_CIDADES = {
    'São Paulo': '1001773', 'Santo André': '1001765', 'São Bernardo do Campo': '1001767',
    'São Caetano do Sul': '1001768', 'Diadema': '1031606', 'Guarulhos': '1001736', 'Osasco': '1001754',
    'Campinas': '1001729', 'Sorocaba': '1001776', 'Jundiaí': '1001743', 'São José dos Campos': '1001772',
    'Taubaté': '1001778', 'Pindamonhangaba': '1001757', 'Piracicaba': '1001758', 'Indaiatuba': '1001738',
    'Sertãozinho': '1032035', 'Belo Horizonte': '1001566', 'Betim': '1031483', 'Contagem': '1031586',
    'Ipatinga': '1001572', 'Volta Redonda': '1032132', 'Resende': '1031967', 'Rio de Janeiro': '1001655',
    'Curitiba': '1001634', 'São José dos Pinhais': '1032065', 'Joinville': '1001710',
    'Jaraguá do Sul': '1031754', 'Blumenau': '1001698', 'São Bento do Sul': '1032046',
    'Caxias do Sul': '1001672', 'Porto Alegre': '1001686', 'Canoas': '1001670', 'Gravataí': '1031654',
    'Camaçari': '1031518', 'Manaus': '1001511', 'Serra': '1001547',
}
LOC = {'AR': ['AR'], 'BR': list(BR_CIDADES.values()), 'MX': ['MX'], 'LATAM': ['PE', 'CO', 'CL', 'EC', 'BO', 'PY', 'UY', 'DO']}
BID = {'01': 1.30, '02': 1.00, '03': 1.20, '04': 0.90, '05': 0.90, '06': 0.80, '07': 0.50}
BUDGET = {('conformado', 'AR'): 2, ('conformado', 'MX'): 5, ('conformado', 'LATAM'): 4, ('conformado', 'BR'): 3,
          ('mecanizado', 'BR'): 6, ('mecanizado', 'AR'): 3}

NEG_EXTRA = {
    'ES': ['madera', 'carpintería', 'carpinteria', 'aserrín', 'aserrin', 'aspiradora', 'leña', 'papas fritas', 'pellet'],
    'PT': ['madeira', 'biomassa', 'eucalipto', 'serraria', 'marcenaria', 'picador', 'pellet', 'lenha', 'serragem', 'aspirador'],
}
LIST_NAME = {'ES': 'TF | Negativas | ES', 'PT': 'TF | Negativas | PT'}
created_lists = set()

def neg_list(lang):
    camp = 'TF | Search | Conformado | AR | ES' if lang == 'ES' else 'TF | Search | Conformado | BR | PT'
    words = [r['Keyword'] for r in NEG_C if r['Campaign'] == camp] + NEG_EXTRA[lang]
    seen = []; [seen.append(w) for w in words if w not in seen]
    entry = {'name': LIST_NAME[lang]}
    if lang not in created_lists:
        entry['keywords'] = [{'text': w, 'match_type': 'PHRASE'} for w in seen]
        created_lists.add(lang)
    return [entry]

def sched(m):
    return [{'day_of_week': d, 'start_hour': a, 'end_hour': b} for d, a, b in SCHED[m]]

def utm(line, m, lang, content=None):
    s = f'utm_source=google&utm_medium=cpc&utm_campaign={line}_search_{m.lower()}_{lang.lower()}'
    if content: s += f'&utm_content={content}'
    return s + '&utm_term={keyword}'

def rsa(name, hs, ds, url, p1, p2, tags):
    H = [{'text': h[:-3], 'pinned_field': 'HEADLINE_1'} if h.endswith('[1]') else h for h in hs]
    return {'name': name, 'status': 'ENABLED', 'creative': {'headlines': H, 'descriptions': ds, 'final_urls': [url], 'path1': p1, 'path2': p2, 'url_tags': tags}}

def conformado(m):
    lang = 'PT' if m == 'BR' else 'ES'
    camp = f'TF | Search | Conformado | {m} | {lang}'
    keep = ['01', '03', '07'] if m in ('AR', 'BR') else ['01', '02', '03', '04', '05', '06', '07']
    groups = []
    for a in [x for x in ADS if x['Campaign'] == camp]:
        g = a['Ad group']; code = g[:2]
        if code not in keep: continue
        kws = [{'text': r['Keyword'], 'match_type': r['Criterion Type'].upper()} for r in KW if r['Campaign'] == camp and r['Ad group'] == g]
        negs = [{'text': r['Keyword'], 'match_type': 'PHRASE'} for r in NEG_G if r['Campaign'] == camp and r['Ad group'] == g]
        hs = []
        for i in range(1, 16):
            h = REPL[m].get(a[f'Headline {i}'], a[f'Headline {i}'])
            hs.append(h + ('[1]' if a[f'Headline {i} position'] == '1' else ''))
        ds = [a[f'Description {i}'] for i in range(1, 5)]
        slug = g[:2] + '-' + g[5:].lower().replace(' ', '-').replace('(', '').replace(')', '').translate(str.maketrans('áéíóúçãõâêô', 'aeioucaoaeo'))
        groups.append({'name': g, 'status': 'ENABLED', 'platform_settings': {'cpc_bid': BID[code]},
                       'targeting': {'keywords': kws, 'negative_keywords': negs},
                       'ads': [rsa('RSA | ' + g, hs, ds, a['Final URL'], a['Path 1'], a['Path 2'], utm('conformado', m, lang, slug))]})
    sl = [{'text': r['Link text'], 'description1': REPL[m].get(r['Description line 1'], r['Description line 1']),
           'description2': REPL[m].get(r['Description line 2'], r['Description line 2']), 'url': r['Final URL']} for r in SL if r['Campaign'] == camp]
    co = [REPL[m].get(r['Callout text'], r['Callout text']) for r in CO if r['Campaign'] == camp and not (m == 'AR' and r['Callout text'] == 'Servicio en la región')]
    sn = [{'header': r['Header'], 'values': r['Snippet values'].split(';')} for r in SN if r['Campaign'] == camp]
    return camp, lang, groups, sl, co, sn

def mecanizado(m):
    if m == 'AR':
        lang, url, p1 = 'ES', 'https://www.transfil.com.ar/mecanizado', 'Mecanizado'
        fab = 'Fabricación propia en Córdoba desde 1989. Repuestos sin plazos de importación.'
        rel = 'Relevamiento en planta antes de cotizar. Un asesor técnico responde en 24 h hábiles.'
        rng = 'Rangos típicos: vida del refrigerante 2 a 4 veces mayor y herramienta +10 a 30%.'
        G = [
            ('01 | Transportador de viruta', 1.00, 'Viruta', [
                'transportador de viruta', 'transportador de virutas', 'transportadores de viruta', 'extractor de viruta',
                'extractor de virutas', 'cinta transportadora de viruta', 'transportador de viruta para torno',
                'transportador de viruta cnc', 'transportador de viruta de bisagra', 'transportador de viruta magnético',
                'transportador de viruta a raspador', 'evacuación de viruta'],
             ['transportador de viruta', 'transportador de virutas', 'extractor de viruta'], [],
             ['Transportador de viruta[1]', 'Transportadores de viruta[1]', 'Bisagra, raspador o magnético', 'Viruta afuera, sin paros',
              'Por máquina o centralizado', 'Relevamiento en planta', 'Solicite un relevamiento', 'Fabricación propia',
              'Respuesta en 24 h hábiles', 'Diseño 3D antes de fabricar', 'Para tornos y centros CNC', 'Con filtro de refrigerante',
              'Operación continua 24/7', 'Fabricante desde 1989', 'Equipos de los 90 en marcha'],
             ['Transportadores de bisagra, raspador o magnéticos según su viruta y su máquina.', rel,
              'Viruta y refrigerante en un solo sistema: transportador y filtro diseñados juntos.', fab]),
            ('02 | Filtración refrigerante', 0.90, 'Refrigerante', [
                'filtración de refrigerante', 'filtro de refrigerante industrial', 'filtro para refrigerante cnc',
                'filtro de refrigerante para torno', 'filtración de soluble', 'filtro para soluble', 'filtrado de soluble',
                'filtro de aceite soluble', 'sistema de filtrado de refrigerante',
                'tratamiento de soluble', 'filtración de fluido de corte', 'filtro para fluido de corte',
                'filtro para rectificadora', 'filtración para mecanizado'],
             ['filtro de refrigerante', 'filtro para soluble'], [],
             ['Filtración de refrigerante[1]', 'Filtración de soluble[1]', 'Filtro para soluble CNC', 'Refrigerante limpio y estable',
              'Vida del soluble x2 a x4', 'Más vida de herramienta', 'Menos recambio de soluble', 'Relevamiento en planta',
              'Solicite un relevamiento', 'Fabricación propia', 'Respuesta en 24 h hábiles', 'Para tornos y centros CNC',
              'Magnético, banda y skimmer', 'Con transporte de viruta', 'Fabricante desde 1989'],
             ['Separación magnética, filtro de banda y skimmer para el refrigerante de sus máquinas.', rel, rng, fab]),
            ('03 | Separador magnético', 0.80, 'Separador', [
                'separador magnético para refrigerante', 'separador magnético para soluble', 'separador magnético de tambor',
                'separador magnético industrial', 'filtro magnético para refrigerante', 'filtro magnético para soluble',
                'separador magnético para rectificadora'],
             ['separador magnético industrial'], 'AR 04',
             ['Separador magnético[1]', 'Separador magnético industrial[1]', 'Retira los finos ferrosos', 'Para refrigerante y soluble',
              'Protege la tela filtrante', 'Mejor acabado superficial', 'Relevamiento en planta', 'Solicite un relevamiento',
              'Fabricación propia', 'Respuesta en 24 h hábiles', 'Vida del soluble x2 a x4', 'Más vida de herramienta',
              'Para tornos y rectificadoras', 'Separador de tambor', 'Fabricante desde 1989'],
             ['Tambores y barras imantadas que retiran los finos ferrosos antes del filtro principal.', rel,
              'Separación magnética, filtro de banda y skimmer en un solo sistema a medida.', fab]),
            ('04 | Filtro de banda', 0.80, 'Filtro-banda', [
                'filtro de banda para refrigerante', 'filtro de banda para soluble', 'filtro de banda por gravedad',
                'filtro de papel para soluble', 'filtro de papel para rectificadora', 'filtro de papel para refrigerante',
                'filtro de lecho de papel', 'filtro de banda de papel'],
             ['filtro de banda por gravedad'], 'AR 05',
             ['Filtro de banda por gravedad[1]', 'Filtro de papel para soluble[1]', 'Avance automático de tela', 'Residuo seco y rebobinado',
              'Bajo costo operativo', 'Para tornos y rectificadoras', 'Relevamiento en planta', 'Solicite un relevamiento',
              'Fabricación propia', 'Respuesta en 24 h hábiles', 'Vida del soluble x2 a x4', 'Menos recambio de soluble',
              'Con separador magnético', 'Fabricante desde 1989', 'Consulte a un asesor técnico'],
             ['Filtración por gravedad con tela de papel o textil y avance automático según nivel.', rel, rng, fab]),
            ('05 | Skimmer aceite', 0.70, 'Skimmer', [
                'skimmer de aceite', 'skimmer industrial', 'skimmer para soluble', 'skimmer para refrigerante', 'oil skimmer',
                'separador de aceite para soluble', 'desnatador de aceite', 'aceite de guías en el soluble', 'separador de aceite atrapado'],
             ['skimmer de aceite'], 'AR 06',
             ['Skimmer de aceite industrial[1]', 'Retire el aceite de guías[1]', 'Menos olor en el soluble', 'Menos caída de pH',
              'Skimmer para soluble', 'Relevamiento en planta', 'Solicite un relevamiento', 'Fabricación propia',
              'Respuesta en 24 h hábiles', 'Vida del soluble x2 a x4', 'Menos recambio de soluble', 'Para tornos y centros CNC',
              'Fabricante desde 1989', 'Consulte a un asesor técnico', 'Central de refrigerante'],
             ['El skimmer retira el aceite de guías que sobrenada, causa de olor y descarte del soluble.', rel, rng, fab]),
        ]
        sl = [
            {'text': 'Solicitar relevamiento', 'description1': 'Visita técnica a su planta', 'description2': 'Respuesta en 24 h hábiles', 'url': url + '#contacto'},
            {'text': 'Cómo funciona el sistema', 'description1': 'Transportador y filtración', 'description2': 'Diseñados juntos', 'url': url + '#sistema'},
            {'text': 'Por qué Trans-Fil', 'description1': 'Fabricación propia en Córdoba', 'description2': 'Repuestos sin importación', 'url': url + '#por-que'},
            {'text': 'Consultas frecuentes', 'description1': 'Qué transportador elegir', 'description2': 'Resultados típicos', 'url': url + '#faq'},
        ]
        co = ['Fabricación propia', 'Relevamiento en planta', 'Respuesta en 24 h hábiles', 'Validado en 3D',
              'Repuestos sin importación', 'Desde 1989 en Córdoba', 'Operación continua 24/7']
        sn = [{'header': 'Types', 'values': ['Transportador de bisagra', 'Transportador a raspador', 'Transportador magnético',
                                              'Filtro de banda', 'Separador magnético', 'Skimmer de aceite']}]
    else:
        lang, url, p1 = 'PT', 'https://www.transfil.com.ar/pt/usinagem', 'Usinagem'
        fab = 'Fabricação própria em Córdoba, Argentina, desde 1989. Clientes em 14 países.'
        rel = 'Levantamento em planta antes da proposta. Um consultor técnico responde em 24 h úteis.'
        rng = 'Faixas típicas: vida do fluido 2 a 4 vezes maior e ferramenta +10 a 30%.'
        G = [
            ('01 | Transportador de cavacos', 1.30, 'Cavacos', [
                'transportador de cavaco', 'transportador de cavacos', 'esteira de cavaco', 'esteira de cavacos',
                'esteira para cavaco', 'esteira transportadora de cavaco', 'esteira transportadora de cavacos',
                'transportador de cavaco para torno', 'transportador de cavacos cnc', 'transportador de cavaco articulado',
                'esteira articulada para cavaco', 'transportador de cavaco raspador', 'transportador magnético de cavaco',
                'transportador de limalha', 'extrator de cavaco'],
             ['transportador de cavacos', 'transportador de cavaco', 'esteira de cavaco', 'esteira transportadora de cavaco'], [],
             ['Transportador de cavacos[1]', 'Esteira de cavaco sob medida[1]', 'Esteira articulada ou raspador', 'Cavaco fora, sem paradas',
              'Por máquina ou centralizado', 'Levantamento na planta', 'Solicite um levantamento', 'Fabricação própria',
              'Resposta em 24 h úteis', 'Projeto 3D antes de fabricar', 'Para tornos e centros CNC', 'Com filtragem do fluido',
              'Operação contínua 24/7', 'Fabricante desde 1989', 'Projetos no Brasil'],
             ['Esteira articulada, raspador ou transportador magnético conforme o cavaco e a máquina.', rel,
              'Cavaco e fluido de corte em um só sistema: transportador e filtro projetados juntos.', fab]),
            ('02 | Filtragem fluido de corte', 1.00, 'Fluido-de-corte', [
                'filtragem de fluido de corte', 'filtro para fluido de corte', 'filtro de fluido de corte',
                'sistema de filtragem de fluido de corte', 'filtragem de óleo solúvel', 'filtro de óleo solúvel',
                'tratamento de fluido de corte',
                'reciclagem de fluido de corte', 'filtragem de emulsão', 'filtro para usinagem', 'filtragem para usinagem',
                'filtro para retífica', 'filtragem para retífica'],
             ['filtragem de fluido de corte', 'filtro para fluido de corte'], [],
             ['Filtragem de fluido de corte[1]', 'Filtro para fluido de corte[1]', 'Filtragem de óleo solúvel', 'Fluido limpo e estável',
              'Vida do fluido x2 a x4', 'Mais vida da ferramenta', 'Menos trocas de fluido', 'Levantamento na planta',
              'Solicite um levantamento', 'Fabricação própria', 'Resposta em 24 h úteis', 'Para tornos e centros CNC',
              'Magnético, esteira e skimmer', 'Com transporte de cavacos', 'Fabricante desde 1989'],
             ['Separação magnética, filtro de esteira e skimmer para o fluido de corte das máquinas.', rel, rng, fab]),
            ('03 | Separador magnético', 0.90, 'Separador', [
                'separador magnético para fluido de corte', 'separador magnético para usinagem', 'separador magnético para retífica',
                'separador magnético de tambor', 'separador magnético industrial', 'filtro magnético para fluido de corte',
                'filtro magnético industrial'],
             ['separador magnético industrial', 'separador magnético de tambor'], 'BR 04',
             ['Separador magnético[1]', 'Separador magnético industrial[1]', 'Remove os finos ferrosos', 'Para fluido de corte',
              'Protege a manta filtrante', 'Melhor acabamento superficial', 'Levantamento na planta', 'Solicite um levantamento',
              'Fabricação própria', 'Resposta em 24 h úteis', 'Vida do fluido x2 a x4', 'Mais vida da ferramenta',
              'Para tornos e retíficas', 'Separador de tambor', 'Fabricante desde 1989'],
             ['Tambores e barras magnéticas removem os finos ferrosos antes do filtro principal.', rel,
              'Separação magnética, filtro de esteira e skimmer em um único sistema sob medida.', fab]),
            ('04 | Filtro de esteira', 0.90, 'Filtro-papel', [
                'filtro de papel para fluido de corte', 'filtro de papel para retífica', 'filtro de manta para fluido de corte',
                'filtro de esteira para fluido de corte', 'filtro de manta', 'filtro por gravidade para fluido de corte',
                'filtro de papel industrial', 'depurador a tecido'],
             ['filtro de papel industrial'], 'BR 05',
             ['Filtro de papel por gravidade[1]', 'Filtro de manta sob medida[1]', 'Avanço automático da manta', 'Resíduo seco e rebobinado',
              'Baixo custo operacional', 'Para tornos e retíficas', 'Levantamento na planta', 'Solicite um levantamento',
              'Fabricação própria', 'Resposta em 24 h úteis', 'Vida do fluido x2 a x4', 'Menos trocas de fluido',
              'Com separador magnético', 'Fabricante desde 1989', 'Fale com um consultor técnico'],
             ['Filtragem por gravidade com manta de papel ou têxtil e avanço automático por nível.', rel, rng, fab]),
            ('05 | Skimmer óleo', 0.80, 'Skimmer', [
                'skimmer de óleo', 'skimmer para fluido de corte', 'skimmer industrial', 'oil skimmer', 'remoção de óleo tramp',
                'separador de óleo tramp', 'separador de óleo de barramento', 'óleo de barramento no fluido', 'skimmer de esteira',
                'skimmer de disco'],
             ['skimmer de óleo', 'skimmer industrial'], 'BR 06',
             ['Skimmer de óleo industrial[1]', 'Retire o óleo de barramento[1]', 'Menos odor no fluido', 'Menos queda de pH',
              'Skimmer para fluido de corte', 'Levantamento na planta', 'Solicite um levantamento', 'Fabricação própria',
              'Resposta em 24 h úteis', 'Vida do fluido x2 a x4', 'Menos trocas de fluido', 'Para tornos e centros CNC',
              'Fabricante desde 1989', 'Fale com um consultor técnico', 'Central de fluido de corte'],
             ['O skimmer retira o óleo de barramento que flutua no tanque, causa de odor e descarte.', rel, rng, fab]),
        ]
        sl = [
            {'text': 'Solicitar levantamento', 'description1': 'Visita técnica à sua planta', 'description2': 'Resposta em 24 h úteis', 'url': url + '#contacto'},
            {'text': 'Como funciona o sistema', 'description1': 'Transportador e filtragem', 'description2': 'Projetados juntos', 'url': url + '#sistema'},
            {'text': 'Por que a Trans-Fil', 'description1': 'Fabricação própria', 'description2': 'Projetos no Brasil', 'url': url + '#por-que'},
            {'text': 'Dúvidas frequentes', 'description1': 'Qual transportador escolher', 'description2': 'Resultados típicos', 'url': url + '#faq'},
        ]
        co = ['Fabricação própria', 'Levantamento na planta', 'Resposta em 24 h úteis', 'Validado em 3D',
              'Desde 1989', 'Operação contínua 24/7', 'Projetos no Brasil']
        sn = [{'header': 'Types', 'values': ['Esteira articulada', 'Transportador raspador', 'Transportador magnético',
                                              'Filtro de esteira', 'Separador magnético', 'Skimmer de óleo']}]
    camp = f'TF | Search | Mecanizado | {m} | {lang}'
    groups = []
    for name, bid, p2, phrase, exact, negref, hs, ds in G:
        if negref:
            cc, gg = negref.split()
            src = [r for r in NEG_G if mk(r['Campaign']) == cc and r['Ad group'].startswith(gg)]
            negs = [{'text': r['Keyword'], 'match_type': 'PHRASE'} for r in src]
        else:
            negs = []
        kws = [{'text': k, 'match_type': 'PHRASE'} for k in phrase] + [{'text': k, 'match_type': 'EXACT'} for k in exact]
        slug = name[:2] + '-' + name[5:].lower().replace(' ', '-').translate(str.maketrans('áéíóúçãõâêô', 'aeioucaoaeo'))
        groups.append({'name': name, 'status': 'ENABLED', 'platform_settings': {'cpc_bid': bid},
                       'targeting': {'keywords': kws, 'negative_keywords': negs},
                       'ads': [rsa('RSA | ' + name, hs, ds, url, p1, p2, utm('mecanizado', m, lang, slug))]})
    return camp, lang, groups, sl, co, sn

def payload(line, m):
    camp, lang, groups, sl, co, sn = (conformado if line == 'conformado' else mecanizado)(m)
    return {
        'name': camp, 'budget_amount': BUDGET[(line, m)], 'budget_type': 'DAILY', 'bidding_strategy': 'MANUAL_CPC',
        'url_tags': utm(line, m, lang),
        'targeting': {'locations': LOC[m]},
        'platform_settings': {'campaign_type': 'SEARCH', 'geo_target_type': 'PRESENCE',
                              'network_settings': {'search': True, 'search_partners': False, 'display': False},
                              'final_url_expansion': False, 'ad_schedule': sched(m), 'negative_keyword_lists': neg_list(lang)},
        'extensions': {'sitelinks': sl, 'callouts': co, 'structured_snippets': sn},
        'ad_groups': groups,
    }

# La primera campaña de cada idioma crea la lista compartida de negativas;
# las demás la enganchan por nombre.
ORDER = [('conformado', 'AR'), ('mecanizado', 'AR'), ('conformado', 'MX'), ('conformado', 'LATAM'),
         ('conformado', 'BR'), ('mecanizado', 'BR')]
problems = []
for line, m in ORDER:
    p = payload(line, m)
    for g in p['ad_groups']:
        c = g['ads'][0]['creative']
        for h in c['headlines']:
            t = h['text'] if isinstance(h, dict) else h
            if len(t) > 30: problems.append((p['name'], g['name'], 'H', len(t), t))
        if len(set((h['text'] if isinstance(h, dict) else h) for h in c['headlines'])) != len(c['headlines']): problems.append((g['name'], 'dup headline'))
        for d in c['descriptions']:
            if len(d) > 90: problems.append((p['name'], g['name'], 'D', len(d), d))
        for k in ('path1', 'path2'):
            if len(c[k]) > 15: problems.append((g['name'], k, c[k]))
        if not (3 <= len(c['headlines']) <= 15 and 2 <= len(c['descriptions']) <= 4): problems.append((g['name'], 'counts'))
    for s in p['extensions']['sitelinks']:
        if len(s['text']) > 25 or len(s['description1']) > 35 or len(s['description2']) > 35: problems.append(('SL', s))
    for c in p['extensions']['callouts']:
        if len(c) > 25: problems.append(('CO', c))
    for s in p['extensions']['structured_snippets']:
        for v in s['values']:
            if len(v) > 25: problems.append(('SN', v))
    fn = os.path.join(OUT, p['name'].replace(' | ', '_').replace(' ', '-') + '.json')
    json.dump(p, open(fn, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    nk = sum(len(g['targeting']['keywords']) for g in p['ad_groups'])
    print(f"{p['name']}: {len(p['ad_groups'])} grupos, {nk} keywords, presupuesto {p['budget_amount']} USD/día, {os.path.getsize(fn)} bytes")
print('problemas:', problems or 'ninguno')
