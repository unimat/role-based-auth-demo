import Nav from './(components)/Nav'
import './globals.css'

export const metadata = {
  title: 'Role-Based Auth',
  description: 'This is a Role-based Auth Demo Site',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Nav />
        <div className="m-2">{children}</div>
      </body>
    </html>
  )
}
