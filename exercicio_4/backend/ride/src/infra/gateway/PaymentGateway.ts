export default interface PaymentGateway {
    isValide (creditCardToken: string, amount: number): boolean 
    isApproved (): boolean;
}

export class PaymentGatewayMemory implements PaymentGateway {
    isValide(creditCardToken: string, amount: number): boolean {
        return creditCardToken.length > 7 && amount > 0;
    }
    isApproved(): boolean {
        return true;         
    }
}