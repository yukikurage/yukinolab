import Section from "@/components/Section";
import ContactForm from "@/components/ContactForm";

export default function ContactSection() {
  return (
    <Section id="contact" title="CONTACT">
      <div className="w-full flex justify-center items-center">
        <ContactForm />
      </div>
    </Section>
  );
}
