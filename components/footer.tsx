import Link from "next/link"
import { Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card/50 py-4">
      <div className="container mx-auto flex flex-col items-center justify-center gap-2 px-4 text-center text-sm text-muted-foreground">
        <p>
          Desarrollado por{" "}
          <Link
            href="https://www.linkedin.com/in/juan-pablo-birsa/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-primary transition-colors hover:underline"
          >
            Juan Pablo Birsa
            <Linkedin className="h-4 w-4" />
          </Link>
        </p>
      </div>
    </footer>
  )
}
