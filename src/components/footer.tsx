import Link from "next/link"
import { ChefHat, Instagram, Twitter, Facebook, Mail, Heart } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="w-full flex justify-center px-4">
        <div className="w-full max-w-7xl py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="space-y-4 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ChefHat className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">Stop de Ontkoking</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Het moderne digitale kookplatform waar je recepten deelt, ontdekt en opslaat. 
                Sluit je aan bij onze groeiende community!
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Link 
                  href="#" 
                  className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
                <Link 
                  href="#" 
                  className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
                <Link 
                  href="#" 
                  className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </Link>
                <Link 
                  href="#" 
                  className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Mail className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-4">Platform</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/recepten" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform">Recepten</span>
                  </Link>
                </li>
                <li>
                  <Link href="/recepten/nieuw" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform">Recept Toevoegen</span>
                  </Link>
                </li>
                <li>
                  <Link href="/profiel" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform">Mijn Profiel</span>
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform">Aanmelden</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-4">Ondersteuning</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform">Help Center</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform">Contact</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform">FAQ</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform">Community Richtlijnen</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-4">Juridisch</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform">Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform">Gebruiksvoorwaarden</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform">Cookie Policy</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform">Licenties</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-muted-foreground text-center">
            <p>© 2025 Stop de Ontkoking. Alle rechten voorbehouden.</p>
            <p className="flex items-center gap-2 justify-center">
              Gemaakt met <Heart className="h-4 w-4 fill-primary text-primary inline-block" /> voor kookliefhebbers
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
