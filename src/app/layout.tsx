import './globals.css'

export const metadata = {
  title: '방어구 강화 시뮬레이터',
  description: '방어구 강화 시뮬레이터입니다.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}