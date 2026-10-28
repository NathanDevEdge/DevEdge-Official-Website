import { Link } from "wouter";
import LegalPage from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export default function TermsOfUse() {
  return (
    <LegalPage
      title="Terms of Use"
      description="The terms that apply when you use the DevEdge website and client portal."
      path="/terms"
      updated="28 October 2026"
    >
      <p>
        These terms apply to your use of devedge.com.au and the DevEdge client portal, operated by DevEdge
        {SITE.abn && <> (ABN {SITE.abn})</>}. By using the site, you agree to them.
      </p>

      <h2>Our website</h2>
      <p>
        The content on this site is general information about DevEdge and our services. It isn't professional
        advice for your specific situation. We work to keep it accurate, but we don't guarantee it's complete or
        up to date.
      </p>

      <h2>Projects and quotes</h2>
      <p>
        Nothing on this website is an offer or a quote. Every project is scoped and quoted individually, and the
        work is governed by the written proposal or agreement we sign with you, not by these terms.
      </p>

      <h2>Client portal</h2>
      <ul>
        <li>Portal access is by invitation only, for our clients and their nominated team members.</li>
        <li>Keep your login details secure. You're responsible for activity under your account.</li>
        <li>
          Only upload files and information you have the right to share, and nothing unlawful, harmful or
          containing malware.
        </li>
        <li>We may suspend or remove access if an account is misused or when an engagement ends.</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        The DevEdge name, logo, website design and content belong to DevEdge. Don't copy or reuse them without our
        permission. Client work is shown with our clients' approval. Their names and logos remain theirs.
      </p>

      <h2>Links to other sites</h2>
      <p>
        We link to client and third-party websites. We aren't responsible for their content or how they handle
        your information.
      </p>

      <h2>Liability</h2>
      <p>
        Nothing in these terms excludes rights you have under the Australian Consumer Law that can't be excluded.
        Otherwise, to the extent permitted by law, we aren't liable for any loss arising from your use of this
        website.
      </p>

      <h2>Privacy</h2>
      <p>
        How we handle personal information is explained in our <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>Changes and governing law</h2>
      <p>
        We may update these terms from time to time, and the latest version will always be on this page. These
        terms are governed by the laws of Australia.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </LegalPage>
  );
}
