const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Resetting database...');

  await prisma.cardMember.deleteMany({});
  await prisma.boardMember.deleteMany({});
  await prisma.checklistItem.deleteMany({});
  await prisma.checklist.deleteMany({});
  await prisma.label.deleteMany({});
  await prisma.member.deleteMany({});
  await prisma.card.deleteMany({});
  await prisma.list.deleteMany({});
  await prisma.board.deleteMany({});

  console.log('Creating team members...');
  const members = await Promise.all([
    prisma.member.create({
      data: { name: 'Aarav Mehta', avatarColor: '#2563EB' },
    }),
    prisma.member.create({
      data: { name: 'Neha Sharma', avatarColor: '#F97316' },
    }),
    prisma.member.create({
      data: { name: 'Kabir Singh', avatarColor: '#10B981' },
    }),
    prisma.member.create({
      data: { name: 'Priya Nair', avatarColor: '#8B5CF6' },
    }),
    prisma.member.create({
      data: { name: 'Rahul Verma', avatarColor: '#EF4444' },
    }),
  ]);

  const [aarav, neha, kabir, priya, rahul] = members;

  console.log('Creating sample board...');
  const boardId = 'cmnak7ro40000cducgl458ey2';

  const board = await prisma.board.create({
    data: {
      id: boardId,
      title: 'Product Launch Board',
      backgroundColor: '#0F4C81',
      members: {
        create: members.map((member) => ({
          memberId: member.id,
        })),
      },
      lists: {
        create: [
          {
            title: 'Backlog',
            position: 1,
            cards: {
              create: [
                {
                  title: 'Write launch checklist',
                  description: 'Capture everything we need before release day.',
                  position: 1,
                  labels: {
                    create: [
                      { name: 'Planning', color: '#60A5FA' },
                      { name: 'Ops', color: '#22C55E' },
                    ],
                  },
                  checklists: {
                    create: [
                      {
                        title: 'Launch checklist',
                        items: {
                          create: [
                            { text: 'Confirm final copy', isCompleted: false },
                            { text: 'Review release notes', isCompleted: false },
                            { text: 'Schedule announcement', isCompleted: true },
                          ],
                        },
                      },
                    ],
                  },
                  members: {
                    create: [
                      { memberId: aarav.id },
                      { memberId: neha.id },
                    ],
                  },
                },
                {
                  title: 'Prepare support FAQ',
                  description: 'Short answers for common launch questions.',
                  position: 2,
                  labels: {
                    create: [{ name: 'Support', color: '#A855F7' }],
                  },
                  members: {
                    create: [{ memberId: priya.id }],
                  },
                },
              ],
            },
          },
          {
            title: 'In Progress',
            position: 2,
            cards: {
              create: [
                {
                  title: 'Polish card modal on mobile',
                  description: 'Keep the modal readable and easy to use on smaller screens.',
                  position: 1,
                  labels: {
                    create: [
                      { name: 'Frontend', color: '#F59E0B' },
                      { name: 'UI', color: '#EC4899' },
                    ],
                  },
                  checklists: {
                    create: [
                      {
                        title: 'Responsive checks',
                        items: {
                          create: [
                            { text: 'Test small screens', isCompleted: true },
                            { text: 'Check scrolling', isCompleted: true },
                            { text: 'Verify label rows', isCompleted: false },
                          ],
                        },
                      },
                    ],
                  },
                  members: {
                    create: [
                      { memberId: kabir.id },
                      { memberId: rahul.id },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'Done',
            position: 3,
            cards: {
              create: [
                {
                  title: 'Set up Prisma models',
                  position: 1,
                  labels: {
                    create: [{ name: 'Backend', color: '#14B8A6' }],
                  },
                  members: {
                    create: [{ memberId: aarav.id }],
                  },
                },
                {
                  title: 'Create board filters',
                  position: 2,
                  labels: {
                    create: [{ name: 'Search', color: '#38BDF8' }],
                  },
                  members: {
                    create: [
                      { memberId: neha.id },
                      { memberId: priya.id },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`Seed complete. Board ID: ${board.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
