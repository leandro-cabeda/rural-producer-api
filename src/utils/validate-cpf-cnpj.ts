export class CpfCnpjValidator {
  static isValidCpfCnpj(value: string): boolean {
    if (!value) return false;

    const cleanedValue = value.replace(/\D/g, ''); // Remove caracteres não numéricos
    console.log(`Validando: ${cleanedValue}`); // Debug

    if (cleanedValue.length === 11) {
      return this.isValidCpf(cleanedValue);
    } else if (cleanedValue.length === 14) {
      return this.isValidCnpj(cleanedValue);
    }
    return false;
  }

  private static isValidCpf(cpf: string): boolean {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; // Verifica sequências repetidas

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpf.charAt(9))) return false; // Primeiro dígito verificador

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    return rest === parseInt(cpf.charAt(10)); // Segundo dígito verificador
  }

  private static isValidCnpj(cnpj: string): boolean {
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false; // Verifica sequências repetidas

    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const calculateDigit = (cnpjPart: string, weights: number[]) => {
      let sum = 0;
      weights.forEach((weight, index) => {
        sum += parseInt(cnpjPart.charAt(index)) * weight;
      });
      let remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const firstDigit = calculateDigit(cnpj.substring(0, 12), weights1);
    const secondDigit = calculateDigit(cnpj.substring(0, 13), weights2);

    return firstDigit === parseInt(cnpj.charAt(12)) && secondDigit === parseInt(cnpj.charAt(13));
  }
}

// Testes de CPF e CNPJ válidos
const validCpfs = ["529.982.247-25", "12345678909"];
const validCnpjs = ["11.222.333/0001-81", "11222333000181"];

validCpfs.forEach((cpf) => {
  console.log(`${cpf} é válido?`, CpfCnpjValidator.isValidCpfCnpj(cpf));
});

validCnpjs.forEach((cnpj) => {
  console.log(`${cnpj} é válido?`, CpfCnpjValidator.isValidCpfCnpj(cnpj));
});
  