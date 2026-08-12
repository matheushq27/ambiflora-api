import { PrismaClient, UserType } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o seed...');

  // 1. Verificar se a empresa já existe para evitar duplicações
  let masterCompany = await prisma.company.findFirst({
    where: { name: 'Ambiflora (Sede)' }
  });

  if (!masterCompany) {
    masterCompany = await prisma.company.create({
      data: {
        name: 'Ambiflora (Sede)',
        city: 'Desconhecida',
        state: 'XX',
        street: 'Rua Principal',
        postalCode: 0,
        country: 'Brasil',
        locationNumber: 0
      }
    });
    console.log('🏢 Empresa Sede criada.');
  }

  // 2. Criar o usuário Master
  const adminEmail = 'admin@ambiflora.com.br';
  let adminUser = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!adminUser) {
    const passwordHash = await hash('admin123', 8);

    adminUser = await prisma.user.create({
      data: {
        name: 'Administrador',
        surname: 'Master',
        email: adminEmail,
        password: passwordHash,
        userType: UserType.SUPER_ADMIN,
        companyId: masterCompany.id
      }
    });
    console.log('👤 Usuário Administrador Master criado.');
  } else {
    console.log('⚠️ Usuário Administrador Master já existe no banco.');
  }

  console.log('-------------------------------------------');
  console.log('✅ Seed concluído com sucesso!');
  console.log(`📧 Email: ${adminEmail}`);
  console.log(`🔑 Senha: admin123`);
  console.log('-------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
