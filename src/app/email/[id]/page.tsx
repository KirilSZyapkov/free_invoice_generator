import EmailForm from "@/components/forms/EmailForm";

const EmailPage = async ({params}: { params: Promise<{ id: string }
>
}) => {
  const {id} = await params;
  return (
    <section>
      <h1>Email Page</h1>
      <EmailForm/>
    </section>
  )
};

export default EmailPage;