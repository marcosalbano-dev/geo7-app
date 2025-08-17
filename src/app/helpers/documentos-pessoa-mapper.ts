import { FormControl, FormGroup } from "@angular/forms";

// helpers genéricas
export function toggleControls(
  form: FormGroup,
  keys: string[],
  enable: boolean,
  clear = false
) {
  keys.forEach(k => {
    let c = form.get(k);
    if (!c) {
      // cria o controle se não existir para evitar o erro no template
      c = new FormControl(null);
      form.addControl(k, c);
    }
    if (enable) c.enable({ emitEvent: false });
    else c.disable({ emitEvent: false });

    if (clear) c.reset({ value: null, disabled: !enable }, { emitEvent: false });
  });
}
