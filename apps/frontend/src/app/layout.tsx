import './global.css';

export const metadata = {
  title: 'Agente de Matching de Vagas',
  description: 'Compare seu currículo com vagas e veja o ranking de compatibilidade',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
