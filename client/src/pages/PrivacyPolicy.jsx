import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import Footer from '../components/Footer';

const CCPA_CATEGORIES = [
  { cat: 'A. Identifiers', examples: 'Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name', collected: 'YES' },
  { cat: 'B. Personal information as defined in the California Customer Records statute', examples: 'Name, contact information, education, employment, employment history, and financial information', collected: 'NO' },
  { cat: 'C. Protected classification characteristics under state or federal law', examples: 'Gender, age, date of birth, race and ethnicity, national origin, marital status, and other demographic data', collected: 'NO' },
  { cat: 'D. Commercial information', examples: 'Transaction information, purchase history, financial details, and payment information', collected: 'YES' },
  { cat: 'E. Biometric information', examples: 'Fingerprints and voiceprints', collected: 'NO' },
  { cat: 'F. Internet or other similar network activity', examples: 'Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements', collected: 'NO' },
  { cat: 'G. Geolocation data', examples: 'Device location', collected: 'NO' },
  { cat: 'H. Audio, electronic, sensory, or similar information', examples: 'Images and audio, video or call recordings created in connection with our business activities', collected: 'YES' },
  { cat: 'I. Professional or employment-related information', examples: 'Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us', collected: 'NO' },
  { cat: 'J. Education Information', examples: 'Student records and directory information', collected: 'NO' },
  { cat: 'K. Inferences drawn from collected personal information', examples: 'Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual’s preferences and characteristics', collected: 'NO' },
  { cat: 'L. Sensitive personal information', examples: '—', collected: 'NO' },
];

function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-bold mt-10 mb-3">{title}</h2>
      <div className="space-y-3 text-muted text-sm leading-relaxed">{children}</div>
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="border-b border-border px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Scissors size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">VoxFrame</span>
        </Link>
        <Link to="/" className="btn-secondary text-sm">Back home</Link>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-8 py-16 w-full">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted text-sm mb-10">Last updated July 07, 2026</p>

        <p className="text-muted text-sm leading-relaxed">
          This Privacy Notice for VoxFrame ("we," "us," or "our") describes how and why we might access, collect,
          store, use, and/or share ("process") your personal information when you use our services ("Services"),
          including when you:
        </p>
        <ul className="list-disc list-inside text-muted text-sm leading-relaxed mt-3 space-y-1">
          <li>
            Visit our website at{' '}
            <a href="https://voxframe-production.up.railway.app/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              https://voxframe-production.up.railway.app/
            </a>{' '}
            or any website of ours that links to this Privacy Notice
          </li>
          <li>
            Use VoxFrame. An editing tool for faceless YouTube content creators that automatically syncs a
            voiceover to images, if you include a timestamped .JSON file.
          </li>
          <li>Engage with us in other related ways, including any marketing or events</li>
        </ul>

        <p className="text-muted text-sm leading-relaxed mt-4">
          <strong className="text-white">Questions or concerns?</strong> Reading this Privacy Notice will help you
          understand your privacy rights and choices. We are responsible for making decisions about how your
          personal information is processed. If you do not agree with our policies and practices, please do not use
          our Services. If you still have any questions or concerns, please contact us at{' '}
          <a href="mailto:only86177@gmail.com" className="text-accent hover:underline">only86177@gmail.com</a>.
        </p>

        <h2 className="text-xl font-bold mt-10 mb-3">Summary of Key Points</h2>
        <p className="text-muted text-sm leading-relaxed italic">
          This summary provides key points from our Privacy Notice, but you can find out more details about any of
          these topics by using the table of contents below to find the section you are looking for.
        </p>
        <ul className="text-muted text-sm leading-relaxed mt-3 space-y-3">
          <li><strong className="text-white">What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.</li>
          <li><strong className="text-white">Do we process any sensitive personal information?</strong> We do not process sensitive personal information.</li>
          <li><strong className="text-white">Do we collect any information from third parties?</strong> We do not collect any information from third parties.</li>
          <li><strong className="text-white">How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</li>
          <li><strong className="text-white">In what situations and with which parties do we share personal information?</strong> We may share information in specific situations and with specific third parties.</li>
          <li><strong className="text-white">How do we keep your information safe?</strong> We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.</li>
          <li><strong className="text-white">What are your rights?</strong> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.</li>
          <li><strong className="text-white">How do you exercise your rights?</strong> The easiest way to exercise your rights is by contacting us at <a href="mailto:only86177@gmail.com" className="text-accent hover:underline">only86177@gmail.com</a>. We will consider and act upon any request in accordance with applicable data protection laws.</li>
        </ul>

        <h2 id="toc" className="text-xl font-bold mt-10 mb-3 scroll-mt-24">Table of Contents</h2>
        <ol className="text-accent text-sm leading-loose list-decimal list-inside">
          <li><a href="#infocollect" className="hover:underline">What Information Do We Collect?</a></li>
          <li><a href="#infouse" className="hover:underline">How Do We Process Your Information?</a></li>
          <li><a href="#legalbases" className="hover:underline">What Legal Bases Do We Rely On To Process Your Personal Information?</a></li>
          <li><a href="#whoshare" className="hover:underline">When And With Whom Do We Share Your Personal Information?</a></li>
          <li><a href="#inforetain" className="hover:underline">How Long Do We Keep Your Information?</a></li>
          <li><a href="#infosafe" className="hover:underline">How Do We Keep Your Information Safe?</a></li>
          <li><a href="#infominors" className="hover:underline">Do We Collect Information From Minors?</a></li>
          <li><a href="#privacyrights" className="hover:underline">What Are Your Privacy Rights?</a></li>
          <li><a href="#dnt" className="hover:underline">Controls For Do-Not-Track Features</a></li>
          <li><a href="#uslaws" className="hover:underline">Do United States Residents Have Specific Privacy Rights?</a></li>
          <li><a href="#policyupdates" className="hover:underline">Do We Make Updates To This Notice?</a></li>
          <li><a href="#contact" className="hover:underline">How Can You Contact Us About This Notice?</a></li>
          <li><a href="#request" className="hover:underline">How Can You Review, Update, Or Delete The Data We Collect From You?</a></li>
        </ol>

        <Section id="infocollect" title="1. What Information Do We Collect?">
          <p><strong className="text-white">Personal information you disclose to us</strong></p>
          <p><em>In Short: We collect personal information that you provide to us.</em></p>
          <p>
            We collect personal information that you voluntarily provide to us when you register on the Services,
            express an interest in obtaining information about us or our products and Services, when you
            participate in activities on the Services, or otherwise when you contact us.
          </p>
          <p><strong className="text-white">Personal Information Provided by You.</strong> The personal information that we collect may include the following:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>email addresses</li>
            <li>usernames</li>
            <li>passwords</li>
            <li>contact or authentication data</li>
          </ul>
          <p><strong className="text-white">Sensitive Information.</strong> We do not process sensitive information.</p>
          <p>
            <strong className="text-white">Payment Data.</strong> We may collect data necessary to process your payment
            if you choose to make purchases, such as your payment instrument number and the security code associated
            with your payment instrument. All payment data is handled and stored by Stripe. You may find their
            privacy notice here:{' '}
            <a href="https://stripe.com/privacy" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              https://stripe.com/privacy
            </a>.
          </p>
          <p>All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.</p>

          <p className="pt-2"><strong className="text-white">Information automatically collected</strong></p>
          <p><em>In Short: Some information &mdash; such as your Internet Protocol (IP) address and/or browser and device characteristics &mdash; is collected automatically when you visit our Services.</em></p>
          <p>
            We automatically collect certain information when you visit, use, or navigate the Services. This
            information does not reveal your specific identity (like your name or contact information) but may
            include device and usage information, such as your IP address, browser and device characteristics,
            operating system, language preferences, referring URLs, device name, country, location, information
            about how and when you use our Services, and other technical information. This information is primarily
            needed to maintain the security and operation of our Services, and for our internal analytics and
            reporting purposes.
          </p>
          <p>The information we collect includes:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <em>Log and Usage Data.</em> Log and usage data is service-related, diagnostic, usage, and performance
              information our servers automatically collect when you access or use our Services and which we record
              in log files. Depending on how you interact with us, this log data may include your IP address, device
              information, browser type, and settings and information about your activity in the Services (such as
              the date/time stamps associated with your usage, pages and files viewed, and other actions you take),
              device event information (such as system activity and error reports).
            </li>
          </ul>
        </Section>

        <Section id="infouse" title="2. How Do We Process Your Information?">
          <p><em>In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes only with your prior explicit consent.</em></p>
          <p><strong className="text-white">We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong className="text-white">To facilitate account creation and authentication and otherwise manage user accounts.</strong> We may process your information so you can create and log in to your account, as well as keep your account in working order.</li>
            <li><strong className="text-white">To deliver and facilitate delivery of services to the user.</strong> We may process your information to provide you with the requested service.</li>
            <li><strong className="text-white">To save or protect an individual's vital interest.</strong> We may process your information when necessary to save or protect an individual's vital interest, such as to prevent harm.</li>
          </ul>
        </Section>

        <Section id="legalbases" title="3. What Legal Bases Do We Rely On To Process Your Information?">
          <p><em>In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.</em></p>

          <p className="pt-2"><em><strong className="text-white">If you are located in the EU or UK, this section applies to you.</strong></em></p>
          <p>The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong className="text-white">Consent.</strong> We may process your information if you have given us permission (consent) to use your personal information for a specific purpose. You can withdraw your consent at any time.</li>
            <li><strong className="text-white">Performance of a Contract.</strong> We may process your personal information when we believe it is necessary to fulfill our contractual obligations to you, including providing our Services.</li>
            <li><strong className="text-white">Legal Obligations.</strong> We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved.</li>
            <li><strong className="text-white">Vital Interests.</strong> We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person.</li>
          </ul>

          <p className="pt-2"><em><strong className="text-white">If you are located in Canada, this section applies to you.</strong></em></p>
          <p>
            We may process your information if you have given us specific permission (express consent) to use your
            personal information for a specific purpose, or in situations where your permission can be inferred
            (implied consent). You can withdraw your consent at any time.
          </p>
          <p>In some exceptional cases, we may be legally permitted under applicable law to process your information without your consent, including, for example:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way</li>
            <li>For investigations and fraud detection and prevention</li>
            <li>For business transactions provided certain conditions are met</li>
            <li>If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim</li>
            <li>For identifying injured, ill, or deceased persons and communicating with next of kin</li>
            <li>If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse</li>
            <li>If it is reasonable to expect collection and use with consent would compromise the availability or accuracy of the information and the collection is reasonable for investigating a breach of an agreement or a contravention of the laws of Canada or a province</li>
            <li>If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production of records</li>
            <li>If it was produced by an individual in the course of their employment, business, or profession and the collection is consistent with the purposes for which the information was produced</li>
            <li>If the collection is solely for journalistic, artistic, or literary purposes</li>
            <li>If the information is publicly available and is specified by the regulations</li>
          </ul>
        </Section>

        <Section id="whoshare" title="4. When And With Whom Do We Share Your Personal Information?">
          <p><em>In Short: We may share information in specific situations described in this section and/or with the following third parties.</em></p>
          <p>We may need to share your personal information in the following situations:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong className="text-white">Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            <li><strong className="text-white">Service Providers.</strong> We share information with the third-party service providers that operate our Services, namely Supabase (authentication and database hosting) and Stripe (payment processing).</li>
          </ul>
        </Section>

        <Section id="inforetain" title="5. How Long Do We Keep Your Information?">
          <p><em>In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.</em></p>
          <p>
            We will only keep your personal information for as long as it is necessary for the purposes set out in
            this Privacy Notice, unless a longer retention period is required or permitted by law. No purpose in this
            notice will require us keeping your personal information for longer than the period of time in which you
            have an account with us.
          </p>
          <p>
            When we have no ongoing legitimate business need to process your personal information, we will either
            delete or anonymize such information, or, if this is not possible, then we will securely store your
            personal information and isolate it from any further processing until deletion is possible.
          </p>
        </Section>

        <Section id="infosafe" title="6. How Do We Keep Your Information Safe?">
          <p><em>In Short: We aim to protect your personal information through a system of organizational and technical security measures.</em></p>
          <p>
            We have implemented appropriate and reasonable technical and organizational security measures designed
            to protect the security of any personal information we process. However, despite our safeguards and
            efforts to secure your information, no electronic transmission over the Internet or information storage
            technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers,
            cybercriminals, or other unauthorized third parties will not be able to defeat our security and
            improperly collect, access, steal, or modify your information. You should only access the Services
            within a secure environment.
          </p>
        </Section>

        <Section id="infominors" title="7. Do We Collect Information From Minors?">
          <p><em>In Short: We do not knowingly collect data from or market to minors.</em></p>
          <p>
            VoxFrame is intended for use by individuals who are 18 years of age or older. We do not knowingly
            collect personal information from anyone under the age of 18. If we become aware that we have
            inadvertently collected personal information from a user under 18, we will take steps to delete that
            information as soon as possible. If you believe we may have collected information from a minor, please
            contact us at <a href="mailto:only86177@gmail.com" className="text-accent hover:underline">only86177@gmail.com</a> so we can address it.
          </p>
        </Section>

        <Section id="privacyrights" title="8. What Are Your Privacy Rights?">
          <p><em>In Short: Depending on your state of residence in the US or in some regions, such as the European Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.</em></p>
          <p>
            In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under applicable
            data protection laws. These may include the right (i) to request access and obtain a copy of your
            personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your
            personal information; (iv) if applicable, to data portability; and (v) not to be subject to automated
            decision-making. In certain circumstances, you may also have the right to object to the processing of
            your personal information. You can make such a request by contacting us using the details in{' '}
            <a href="#contact" className="text-accent hover:underline">How Can You Contact Us About This Notice?</a> below.
          </p>
          <p>We will consider and act upon any request in accordance with applicable data protection laws.</p>
          <p>
            If you are located in the EEA or UK and you believe we are unlawfully processing your personal
            information, you also have the right to complain to your{' '}
            <a href="https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Member State data protection authority</a>
            {' '}or{' '}
            <a href="https://ico.org.uk/make-a-complaint/data-protection-complaints/data-protection-complaints/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">UK data protection authority</a>.
          </p>
          <p>
            If you are located in Switzerland, you may contact the{' '}
            <a href="https://www.edoeb.admin.ch/edoeb/en/home.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Federal Data Protection and Information Commissioner</a>.
          </p>
          <p>
            <strong className="text-white">Withdrawing your consent:</strong> If we are relying on your consent to
            process your personal information, you have the right to withdraw your consent at any time by
            contacting us using the details in the section below. However, please note that this will not affect the
            lawfulness of the processing before its withdrawal.
          </p>
          <p className="pt-2"><strong className="text-white">Account Information</strong></p>
          <p>If you would at any time like to review or change the information in your account or terminate your account, you can:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Log in to your account settings and update your user account.</li>
          </ul>
          <p>
            Upon your request to terminate your account, we will deactivate or delete your account and information
            from our active databases. However, we may retain some information in our files to prevent fraud,
            troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with
            applicable legal requirements.
          </p>
          <p>
            If you have questions or comments about your privacy rights, you may email us at{' '}
            <a href="mailto:only86177@gmail.com" className="text-accent hover:underline">only86177@gmail.com</a>.
          </p>
        </Section>

        <Section id="dnt" title="9. Controls For Do-Not-Track Features">
          <p>
            Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track
            ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your
            online browsing activities monitored and collected. At this stage, no uniform technology standard for
            recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT
            browser signals or any other mechanism that automatically communicates your choice not to be tracked
            online. If a standard for online tracking is adopted that we must follow in the future, we will inform
            you about that practice in a revised version of this Privacy Notice.
          </p>
          <p>
            California law requires us to let you know how we respond to web browser DNT signals. Because there
            currently is not an industry or legal standard for recognizing or honoring DNT signals, we do not respond
            to them at this time.
          </p>
        </Section>

        <Section id="uslaws" title="10. Do United States Residents Have Specific Privacy Rights?">
          <p><em>In Short: If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have the right to request access to and receive details about the personal information we maintain about you and how we have processed it, correct inaccuracies, get a copy of, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law.</em></p>

          <p className="pt-2"><strong className="text-white">Categories of Personal Information We Collect</strong></p>
          <p>The table below shows the categories of personal information we have collected in the past twelve (12) months.</p>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-xs border-collapse border border-border">
              <thead>
                <tr className="bg-card">
                  <th className="border border-border p-2 text-left">Category</th>
                  <th className="border border-border p-2 text-left">Examples</th>
                  <th className="border border-border p-2 text-left">Collected</th>
                </tr>
              </thead>
              <tbody>
                {CCPA_CATEGORIES.map((row) => (
                  <tr key={row.cat}>
                    <td className="border border-border p-2">{row.cat}</td>
                    <td className="border border-border p-2">{row.examples}</td>
                    <td className="border border-border p-2">{row.collected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="pt-2"><strong className="text-white">Sources of Personal Information</strong></p>
          <p>We collect personal information directly from you &mdash; through the account you create and the content you upload. We do not purchase or receive personal information about you from third-party data sources.</p>

          <p className="pt-2"><strong className="text-white">Will your information be shared with anyone else?</strong></p>
          <p>
            We may disclose your personal information with our service providers (Supabase and Stripe) pursuant to a
            written contract between us and each service provider. We have not disclosed, sold, or shared any
            personal information to third parties for a business or commercial purpose in the preceding twelve (12)
            months, and we will not sell or share personal information belonging to website visitors, users, and
            other consumers in the future.
          </p>

          <p className="pt-2"><strong className="text-white">Your Rights</strong></p>
          <p>You have rights under certain US state data protection laws. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law. These rights include:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong className="text-white">Right to know</strong> whether or not we are processing your personal data</li>
            <li><strong className="text-white">Right to access</strong> your personal data</li>
            <li><strong className="text-white">Right to correct</strong> inaccuracies in your personal data</li>
            <li><strong className="text-white">Right to request</strong> the deletion of your personal data</li>
            <li><strong className="text-white">Right to obtain a copy</strong> of the personal data you previously shared with us</li>
            <li><strong className="text-white">Right to non-discrimination</strong> for exercising your rights</li>
            <li><strong className="text-white">Right to opt out</strong> of the processing of your personal data if it is used for targeted advertising, the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects</li>
          </ul>

          <p className="pt-2"><strong className="text-white">How to Exercise Your Rights</strong></p>
          <p>
            To exercise these rights, you can contact us by emailing{' '}
            <a href="mailto:only86177@gmail.com" className="text-accent hover:underline">only86177@gmail.com</a>, or by
            referring to the contact details at the bottom of this document.
          </p>
          <p>
            Under certain US state data protection laws, you can designate an authorized agent to make a request on
            your behalf. We may deny a request from an authorized agent that does not submit proof that they have
            been validly authorized to act on your behalf.
          </p>

          <p className="pt-2"><strong className="text-white">Request Verification</strong></p>
          <p>
            Upon receiving your request, we will need to verify your identity to determine you are the same person
            about whom we have the information in our system. We will only use personal information provided in
            your request to verify your identity or authority to make the request.
          </p>

          <p className="pt-2"><strong className="text-white">Appeals</strong></p>
          <p>
            Under certain US state data protection laws, if we decline to take action regarding your request, you
            may appeal our decision by emailing us at{' '}
            <a href="mailto:only86177@gmail.com" className="text-accent hover:underline">only86177@gmail.com</a>. We
            will inform you in writing of any action taken or not taken in response to the appeal. If your appeal is
            denied, you may submit a complaint to your state attorney general.
          </p>
        </Section>

        <Section id="policyupdates" title="11. Do We Make Updates To This Notice?">
          <p><em>In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.</em></p>
          <p>
            We may update this Privacy Notice from time to time. The updated version will be indicated by an updated
            "Revised" date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we
            may notify you either by prominently posting a notice of such changes or by directly sending you a
            notification. We encourage you to review this Privacy Notice frequently to be informed of how we are
            protecting your information.
          </p>
        </Section>

        <Section id="contact" title="12. How Can You Contact Us About This Notice?">
          <p>
            If you have questions or comments about this notice, you may email us at{' '}
            <a href="mailto:only86177@gmail.com" className="text-accent hover:underline">only86177@gmail.com</a>.
          </p>
          <p className="pt-2">VoxFrame<br />United States</p>
        </Section>

        <Section id="request" title="13. How Can You Review, Update, Or Delete The Data We Collect From You?">
          <p>
            Based on the applicable laws of your country or state of residence, you may have the right to request
            access to the personal information we collect from you, details about how we have processed it, correct
            inaccuracies, or delete your personal information. You may also have the right to withdraw your consent
            to our processing of your personal information. These rights may be limited in some circumstances by
            applicable law. To request to review, update, or delete your personal information, please contact us at{' '}
            <a href="mailto:only86177@gmail.com" className="text-accent hover:underline">only86177@gmail.com</a>.
          </p>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
