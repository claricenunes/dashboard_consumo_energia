export function exportToCSV(rows, filename) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = row[h] ?? ''
          const str = String(val).replace(/"/g, '""')
          return str.includes(',') || str.includes('"') || str.includes('\n')
            ? `"${str}"`
            : str
        })
        .join(',')
    ),
  ].join('\n')

  const BOM = '﻿'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportSectors(sectors) {
  const rows = sectors.map((s) => ({
    Nome: s.nome,
    Categoria: s.categoria,
    'Meta (kWh)': s.consumo_meta,
    'Consumo Atual (kWh)': s.consumo_atual,
    'Status': s.consumo_atual > s.consumo_meta ? 'Acima da Meta' : 'Dentro da Meta',
    'Criado em': new Date(s.criadoEm).toLocaleDateString('pt-BR'),
  }))
  exportToCSV(rows, 'setores')
}

export function exportOperators(operators, sectors) {
  const sectorMap = Object.fromEntries(sectors.map((s) => [s.id, s.nome]))
  const rows = operators.map((o) => ({
    Matrícula: o.matricula,
    Nome: o.nome,
    Setor: sectorMap[o.setorId] ?? '—',
    Turno: o.turno,
    'Cadastrado em': new Date(o.criadoEm).toLocaleDateString('pt-BR'),
  }))
  exportToCSV(rows, 'operadores')
}
