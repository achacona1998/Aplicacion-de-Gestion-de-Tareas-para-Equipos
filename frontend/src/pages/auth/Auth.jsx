import { useState } from "react";
import { Images } from "../../components/auth/Images";
import Form from "../../components/auth/Form";

export default function Auth() {
  const [selected, setSelected] = useState("login");
  return (
    <section className="p-4 h-screen flex justify-center items-center bg-blue-100">
      <div className="w-full max-w-6xl mx-auto shadow-lg flex flex-col-reverse lg:flex-row rounded-lg overflow-hidden bg-white">
        <Form selected={selected} setSelected={setSelected} />
        <Images selected={selected} />
      </div>
    </section>
  );
}
