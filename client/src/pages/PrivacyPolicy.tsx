import LegalPage from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How DevEdge collects, uses, stores and protects your personal information."
      path="/privacy"
      updated="28 October 2026"
    >
      <p>
        DevEdge{SITE.abn && <> (ABN {SITE.abn})</>} ("DevEdge", "we", "us") respects your privacy. This policy
        explains what personal information we collect, why we collect it, and how we handle it, in line with the
        Australian Privacy Principles in the <em>Privacy Act 1988</em> (Cth).
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Enquiries:</strong> when you use our contact form or email or call us, we collect your name, email
          address, phone number (if provided), the service you're interested in and your message.
        </li>
        <li>
          <strong>Client portal accounts:</strong> if you're a client, we collect your name, email address, company,
          and a securely hashed password. We also store the tickets, comments and files you or your team submit.
        </li>
        <li>
          <strong>Website usage:</strong> we use Google Analytics to understand how visitors use our site (pages
          visited, device and browser type, approximate location and how you found us). This information is not
          used to identify you personally.
        </li>
        <li>
          <strong>Client project data:</strong> when we work on your website, systems or marketing accounts, we may
          access data you give us access to. We only use it to deliver the work you've engaged us for.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To respond to your enquiry and discuss your project.</li>
        <li>To deliver our services, including the client portal, support tickets and notifications.</li>
        <li>To send you emails you'd reasonably expect, such as ticket updates, invitations and password resets.</li>
        <li>To understand and improve our website.</li>
        <li>To meet our legal obligations.</li>
      </ul>
      <p>We don't sell your personal information, and we don't use it for unrelated marketing without your consent.</p>

      <h2>Who we share it with</h2>
      <p>We only share personal information with service providers that help us run DevEdge, including:</p>
      <ul>
        <li><strong>Amazon Web Services</strong>: hosting for our website, client portal and database, in Sydney, Australia.</li>
        <li><strong>Resend</strong>: delivery of contact-form and portal notification emails.</li>
        <li><strong>Google</strong>: website analytics.</li>
      </ul>
      <p>
        Some of these providers may process information outside Australia, including in the United States. We take
        reasonable steps to make sure they protect it. We may also disclose information where required by law.
      </p>

      <h2>Cookies and local storage</h2>
      <p>
        Google Analytics uses cookies to measure site usage. The client portal stores a login token in your browser
        so you stay signed in. You can block or delete cookies in your browser settings. The site will still work,
        though you'll need to sign in to the portal again.
      </p>

      <h2>How we protect it</h2>
      <p>
        Our site and portal use encrypted connections (HTTPS). Portal passwords are hashed, never stored in plain
        text. Access to client data is restricted to the people who need it to do the work.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiries and client records for as long as we need them to provide our services and meet our legal
        and tax obligations, then delete or de-identify them.
      </p>

      <h2>Accessing or correcting your information</h2>
      <p>
        You can ask to see the personal information we hold about you, ask us to correct it, or ask us to delete
        your portal account. Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and we'll respond within 30 days.
      </p>

      <h2>Complaints</h2>
      <p>
        If you have a concern about how we've handled your information, contact us first at{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. If you're not satisfied with our response, you can
        contact the Office of the Australian Information Commissioner at{" "}
        <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">oaic.gov.au</a>.
      </p>

      <h2>Changes to this policy</h2>
      <p>We may update this policy from time to time. The latest version will always be on this page.</p>
    </LegalPage>
  );
}
