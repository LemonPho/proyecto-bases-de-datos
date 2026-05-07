import { Link } from "react-router-dom";

export default function AdminHome() {
  const AREAS = [
    { id: "refugio", label: "refugio", color: "bg-green-100" },
    { id: "finanzas", label: "finanzas", color: "bg-blue-100" },
    { id: "animales", label: "animales", color: "bg-orange-100" },
    { id: "adopciones", label: "adopciones", color: "bg-purple-100" },
    { id: "recursos", label: "recursos humanos", color: "bg-pink-100" },
    { id: "inventario", label: "inventario", color: "bg-yellow-100" },
    { id: "rescates", label: "rescates", color: "bg-red-100" },
    { id: "usuarios", label: "usuarios", color: "bg-teal-100" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center bg-white p-10">
      <h2 className="text-3xl font-extrabold text-slate-800">
        ¡Bienvenido!
      </h2>

      <p className="mb-10 mt-2 font-medium italic text-slate-400">
        Selecciona el área o departamento:
      </p>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {AREAS.map((area) => (
          <Link
            key={area.id}
            className={`${area.color} flex h-36 w-36 flex-col items-center justify-center gap-3 rounded-[2.5rem] shadow-sm transition-all hover:shadow-md active:scale-95`}
            to={`/admin/${area.id}`}
          >
            <svg
              fill="#000000"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 495.398 495.398"
              xmlSpace="preserve"
              className="h-10 w-10"
            >
              <g>
                <g>
                  <g>
                    <path d="M487.083,225.514l-75.08-75.08V63.704c0-15.682-12.708-28.391-28.413-28.391c-15.669,0-28.377,12.709-28.377,28.391 v29.941L299.31,37.74c-27.639-27.624-75.694-27.575-103.27,0.05L8.312,225.514c-11.082,11.104-11.082,29.071,0,40.158 c11.087,11.101,29.089,11.101,40.172,0l187.71-187.729c6.115-6.083,16.893-6.083,22.976-0.018l187.742,187.747 c5.567,5.551,12.825,8.312,20.081,8.312c7.271,0,14.541-2.764,20.091-8.312C498.17,254.586,498.17,236.619,487.083,225.514z"></path>
                    <path d="M257.561,131.836c-5.454-5.451-14.285-5.451-19.723,0L72.712,296.913c-2.607,2.606-4.085,6.164-4.085,9.877v120.401 c0,28.253,22.908,51.16,51.16,51.16h81.754v-126.61h92.299v126.61h81.755c28.251,0,51.159-22.907,51.159-51.159V306.79 c0-3.713-1.465-7.271-4.085-9.877L257.561,131.836z"></path>
                  </g>
                </g>
              </g>
            </svg>

            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">
              {area.label}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-12 flex gap-8">
        <button className="font-bold text-slate-400 hover:text-slate-600">
          Cancelar
        </button>

        <button className="rounded-full bg-slate-800 px-12 py-2 font-bold text-white">
          Siguiente
        </button>
      </div>
    </div>
  );
}