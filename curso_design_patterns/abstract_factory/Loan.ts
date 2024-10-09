import crypto from "crypto";

export default abstract class Loan {
    abstract rate: number;

    constructor (readonly loanId: string, readonly amount: number, readonly income: number, readonly installments: number, readonly type: string) {}

    static create (amount: number, income: number, installments: number) {
        throw new Error("This method is abstract");
    }
}

export class MortgageLoan extends Loan {
    rate = 10;

    constructor (loanId: string, amount: number, income: number, installments: number) {
        super(loanId, amount, income, installments, "mortgage");
    }
    static create (amount: number, income: number, installments: number) {
        if (installments > 420) throw new Error("The maximum number of installments is 420");
        if ((income * 0.25) < amount/installments) throw new Error("The installment amount could not exceed 25% of monthly income");        
        const loanId = crypto.randomUUID();
        return new MortgageLoan(loanId, amount, income, installments)
    }
}

export class CarLoan extends Loan {
    rate = 15;

    constructor (loanId: string, amount: number, income: number, installments: number) {
        super(loanId, amount, income, installments, "car");
    }
    static create (amount: number, income: number, installments: number) {
        // Não deve criar um financiamento veicular com prazo superior a 60 meses
        if (installments > 60) throw new Error("The maximum number of installments for can loan is 60");
        if ((income * 0.3) < amount/installments) throw new Error("The installment amount could not exceed 30% of monthly income");        
        const loanId = crypto.randomUUID();
        return new CarLoan(loanId, amount, income, installments)
    }
}