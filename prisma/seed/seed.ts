import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Função para gerar valor entre -20 e 20
function generateRandomValue() {
  return (Math.random() * 40 - 20).toFixed(1) // Gera entre -20 e 20, com uma casa decimal
}

async function main() {
  const chambersData = Array.from({ length: 20 }).map((_, index) => {
    // Para os primeiros 2, será 'press', o restante 'temp'
    const isPress = index > 17
    const type = isPress ? 'press' : 'temp'

    // O status será vazio para 'press', e aleatório para 'temp'
    const status = isPress
      ? ''
      : ['deg', 'vent', 'comp', 'port'][Math.floor(Math.random() * 4)]

    return {
      name: `Câmara ${index + 1}`,
      type,
      status,
      value: Number(parseFloat(generateRandomValue()).toFixed(2)),
    }
  })

  // Usar o createMany para adicionar todas as câmaras de uma vez
  await prisma.chamber.deleteMany()

  const result = await prisma.chamber.createMany({
    data: chambersData,
    skipDuplicates: true, // Ignora duplicatas se houverem
  })

  console.log(`${result.count} câmaras foram adicionadas com sucesso!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
