import logoUrl from "../../assets/logo/LogoAuraPetSinFondo.png";

// El logo de AuraPet como data URL (jsPDF necesita la imagen en ese formato).
// Se pide una sola vez; si falla, el PDF sale igual pero sin logo.
let logo: Promise<string | null> | null = null;

const aDataUrl = (blob: Blob) =>
  new Promise<string>((resolver, rechazar) => {
    const lector = new FileReader();
    lector.onload = () => resolver(String(lector.result));
    lector.onerror = () => rechazar(lector.error);
    lector.readAsDataURL(blob);
  });

export const cargarLogo = (): Promise<string | null> => {
  logo ??= fetch(logoUrl)
    .then((r) => r.blob())
    .then(aDataUrl)
    .catch(() => null);
  return logo;
};
