export interface IMembre {

    infFacturation?: Array<any>
    estMembreActif?: boolean;
    courriel?: string;
    nom?: string;
    prenom?: string;
    adresse?: string;  // Référence à une autre interface
    ville?: string;
    codePostal?: string;
    telephone?: string;
    proffession?: string;
    dateNaissance?: string;
    abonnementFam?: true,
    courrielConjouint?: string;
    teleListe?: boolean;
    nomListe?: boolean;
    animExc?: boolean;
    recenNoel?: boolean;
    animKio?: boolean;
    consAdm?: boolean;
    redacRevi?: boolean;
    promoPubli?: boolean;
    autre?: string;
}
