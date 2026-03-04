"use client";

import { ChangeEvent } from "react";

interface Country {
  code: string;
  dialCode: string;
  flag: string;
  name: string;
}

interface PhoneInputProps {
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onPhoneNumberChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  required?: boolean;
}

const COUNTRIES: Country[] = [
  { code: "AF", dialCode: "+93", flag: "🇦🇫", name: "Afghanistan" },
  { code: "ZA", dialCode: "+27", flag: "🇿🇦", name: "Afrique du Sud" },
  { code: "AL", dialCode: "+355", flag: "🇦🇱", name: "Albanie" },
  { code: "DZ", dialCode: "+213", flag: "🇩🇿", name: "Algérie" },
  { code: "DE", dialCode: "+49", flag: "🇩🇪", name: "Allemagne" },
  { code: "AD", dialCode: "+376", flag: "🇦🇩", name: "Andorre" },
  { code: "AO", dialCode: "+244", flag: "🇦🇴", name: "Angola" },
  { code: "AI", dialCode: "+1264", flag: "🇦🇮", name: "Anguilla" },
  { code: "AG", dialCode: "+1268", flag: "🇦🇬", name: "Antigua-et-Barbuda" },
  { code: "SA", dialCode: "+966", flag: "🇸🇦", name: "Arabie Saoudite" },
  { code: "AR", dialCode: "+54", flag: "🇦🇷", name: "Argentine" },
  { code: "AM", dialCode: "+374", flag: "🇦🇲", name: "Arménie" },
  { code: "AW", dialCode: "+297", flag: "🇦🇼", name: "Aruba" },
  { code: "AU", dialCode: "+61", flag: "🇦🇺", name: "Australie" },
  { code: "AT", dialCode: "+43", flag: "🇦🇹", name: "Autriche" },
  { code: "AZ", dialCode: "+994", flag: "🇦🇿", name: "Azerbaïdjan" },
  { code: "BS", dialCode: "+1242", flag: "🇧🇸", name: "Bahamas" },
  { code: "BH", dialCode: "+973", flag: "🇧🇭", name: "Bahreïn" },
  { code: "BD", dialCode: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "BB", dialCode: "+1246", flag: "🇧🇧", name: "Barbade" },
  { code: "BE", dialCode: "+32", flag: "🇧🇪", name: "Belgique" },
  { code: "BZ", dialCode: "+501", flag: "🇧🇿", name: "Belize" },
  { code: "BJ", dialCode: "+229", flag: "🇧🇯", name: "Bénin" },
  { code: "BM", dialCode: "+1441", flag: "🇧🇲", name: "Bermudes" },
  { code: "BT", dialCode: "+975", flag: "🇧🇹", name: "Bhoutan" },
  { code: "BY", dialCode: "+375", flag: "🇧🇾", name: "Biélorussie" },
  { code: "BO", dialCode: "+591", flag: "🇧🇴", name: "Bolivie" },
  { code: "BA", dialCode: "+387", flag: "🇧🇦", name: "Bosnie-Herzégovine" },
  { code: "BW", dialCode: "+267", flag: "🇧🇼", name: "Botswana" },
  { code: "BR", dialCode: "+55", flag: "🇧🇷", name: "Brésil" },
  { code: "BN", dialCode: "+673", flag: "🇧🇳", name: "Brunei" },
  { code: "BG", dialCode: "+359", flag: "🇧🇬", name: "Bulgarie" },
  { code: "BF", dialCode: "+226", flag: "🇧🇫", name: "Burkina Faso" },
  { code: "BI", dialCode: "+257", flag: "🇧🇮", name: "Burundi" },
  { code: "KH", dialCode: "+855", flag: "🇰🇭", name: "Cambodge" },
  { code: "CM", dialCode: "+237", flag: "🇨🇲", name: "Cameroun" },
  { code: "CA", dialCode: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "CV", dialCode: "+238", flag: "🇨🇻", name: "Cap-Vert" },
  { code: "CL", dialCode: "+56", flag: "🇨🇱", name: "Chili" },
  { code: "CN", dialCode: "+86", flag: "🇨🇳", name: "Chine" },
  { code: "CY", dialCode: "+357", flag: "🇨🇾", name: "Chypre" },
  { code: "CO", dialCode: "+57", flag: "🇨🇴", name: "Colombie" },
  { code: "KM", dialCode: "+269", flag: "🇰🇲", name: "Comores" },
  { code: "CG", dialCode: "+242", flag: "🇨🇬", name: "Congo" },
  { code: "CD", dialCode: "+243", flag: "🇨🇩", name: "Congo (RDC)" },
  { code: "KP", dialCode: "+850", flag: "🇰🇵", name: "Corée du Nord" },
  { code: "KR", dialCode: "+82", flag: "🇰🇷", name: "Corée du Sud" },
  { code: "CR", dialCode: "+506", flag: "🇨🇷", name: "Costa Rica" },
  { code: "CI", dialCode: "+225", flag: "🇨🇮", name: "Côte d'Ivoire" },
  { code: "HR", dialCode: "+385", flag: "🇭🇷", name: "Croatie" },
  { code: "CU", dialCode: "+53", flag: "🇨🇺", name: "Cuba" },
  { code: "CW", dialCode: "+599", flag: "🇨🇼", name: "Curaçao" },
  { code: "DK", dialCode: "+45", flag: "🇩🇰", name: "Danemark" },
  { code: "DJ", dialCode: "+253", flag: "🇩🇯", name: "Djibouti" },
  { code: "DM", dialCode: "+1767", flag: "🇩🇲", name: "Dominique" },
  { code: "EG", dialCode: "+20", flag: "🇪🇬", name: "Égypte" },
  { code: "AE", dialCode: "+971", flag: "🇦🇪", name: "Émirats arabes unis" },
  { code: "EC", dialCode: "+593", flag: "🇪🇨", name: "Équateur" },
  { code: "ER", dialCode: "+291", flag: "🇪🇷", name: "Érythrée" },
  { code: "ES", dialCode: "+34", flag: "🇪🇸", name: "Espagne" },
  { code: "EE", dialCode: "+372", flag: "🇪🇪", name: "Estonie" },
  { code: "SZ", dialCode: "+268", flag: "🇸🇿", name: "Eswatini" },
  { code: "US", dialCode: "+1", flag: "🇺🇸", name: "États-Unis" },
  { code: "ET", dialCode: "+251", flag: "🇪🇹", name: "Éthiopie" },
  { code: "FJ", dialCode: "+679", flag: "🇫🇯", name: "Fidji" },
  { code: "FI", dialCode: "+358", flag: "🇫🇮", name: "Finlande" },
  { code: "FR", dialCode: "+33", flag: "🇫🇷", name: "France" },
  { code: "GA", dialCode: "+241", flag: "🇬🇦", name: "Gabon" },
  { code: "GM", dialCode: "+220", flag: "🇬🇲", name: "Gambie" },
  { code: "GE", dialCode: "+995", flag: "🇬🇪", name: "Géorgie" },
  { code: "GH", dialCode: "+233", flag: "🇬🇭", name: "Ghana" },
  { code: "GI", dialCode: "+350", flag: "🇬🇮", name: "Gibraltar" },
  { code: "GR", dialCode: "+30", flag: "🇬🇷", name: "Grèce" },
  { code: "GD", dialCode: "+1473", flag: "🇬🇩", name: "Grenade" },
  { code: "GL", dialCode: "+299", flag: "🇬🇱", name: "Groenland" },
  { code: "GP", dialCode: "+590", flag: "🇬🇵", name: "Guadeloupe" },
  { code: "GU", dialCode: "+1671", flag: "🇬🇺", name: "Guam" },
  { code: "GT", dialCode: "+502", flag: "🇬🇹", name: "Guatemala" },
  { code: "GG", dialCode: "+44", flag: "🇬🇬", name: "Guernesey" },
  { code: "GN", dialCode: "+224", flag: "🇬🇳", name: "Guinée" },
  { code: "GQ", dialCode: "+240", flag: "🇬🇶", name: "Guinée équatoriale" },
  { code: "GW", dialCode: "+245", flag: "🇬🇼", name: "Guinée-Bissau" },
  { code: "GY", dialCode: "+592", flag: "🇬🇾", name: "Guyana" },
  { code: "GF", dialCode: "+594", flag: "🇬🇫", name: "Guyane française" },
  { code: "HT", dialCode: "+509", flag: "🇭🇹", name: "Haïti" },
  { code: "HN", dialCode: "+504", flag: "🇭🇳", name: "Honduras" },
  { code: "HK", dialCode: "+852", flag: "🇭🇰", name: "Hong Kong" },
  { code: "HU", dialCode: "+36", flag: "🇭🇺", name: "Hongrie" },
  { code: "IN", dialCode: "+91", flag: "🇮🇳", name: "Inde" },
  { code: "ID", dialCode: "+62", flag: "🇮🇩", name: "Indonésie" },
  { code: "IQ", dialCode: "+964", flag: "🇮🇶", name: "Irak" },
  { code: "IR", dialCode: "+98", flag: "🇮🇷", name: "Iran" },
  { code: "IE", dialCode: "+353", flag: "🇮🇪", name: "Irlande" },
  { code: "IS", dialCode: "+354", flag: "🇮🇸", name: "Islande" },
  { code: "IL", dialCode: "+972", flag: "🇮🇱", name: "Israël" },
  { code: "IT", dialCode: "+39", flag: "🇮🇹", name: "Italie" },
  { code: "JM", dialCode: "+1876", flag: "🇯🇲", name: "Jamaïque" },
  { code: "JP", dialCode: "+81", flag: "🇯🇵", name: "Japon" },
  { code: "JE", dialCode: "+44", flag: "🇯🇪", name: "Jersey" },
  { code: "JO", dialCode: "+962", flag: "🇯🇴", name: "Jordanie" },
  { code: "KZ", dialCode: "+7", flag: "🇰🇿", name: "Kazakhstan" },
  { code: "KE", dialCode: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "KG", dialCode: "+996", flag: "🇰🇬", name: "Kirghizistan" },
  { code: "KI", dialCode: "+686", flag: "🇰🇮", name: "Kiribati" },
  { code: "KW", dialCode: "+965", flag: "🇰🇼", name: "Koweït" },
  { code: "LA", dialCode: "+856", flag: "🇱🇦", name: "Laos" },
  { code: "LS", dialCode: "+266", flag: "🇱🇸", name: "Lesotho" },
  { code: "LV", dialCode: "+371", flag: "🇱🇻", name: "Lettonie" },
  { code: "LB", dialCode: "+961", flag: "🇱🇧", name: "Liban" },
  { code: "LR", dialCode: "+231", flag: "🇱🇷", name: "Libéria" },
  { code: "LY", dialCode: "+218", flag: "🇱🇾", name: "Libye" },
  { code: "LI", dialCode: "+423", flag: "🇱🇮", name: "Liechtenstein" },
  { code: "LT", dialCode: "+370", flag: "🇱🇹", name: "Lituanie" },
  { code: "LU", dialCode: "+352", flag: "🇱🇺", name: "Luxembourg" },
  { code: "MO", dialCode: "+853", flag: "🇲🇴", name: "Macao" },
  { code: "MK", dialCode: "+389", flag: "🇲🇰", name: "Macédoine du Nord" },
  { code: "MG", dialCode: "+261", flag: "🇲🇬", name: "Madagascar" },
  { code: "MY", dialCode: "+60", flag: "🇲🇾", name: "Malaisie" },
  { code: "MW", dialCode: "+265", flag: "🇲🇼", name: "Malawi" },
  { code: "MV", dialCode: "+960", flag: "🇲🇻", name: "Maldives" },
  { code: "ML", dialCode: "+223", flag: "🇲🇱", name: "Mali" },
  { code: "MT", dialCode: "+356", flag: "🇲🇹", name: "Malte" },
  { code: "MA", dialCode: "+212", flag: "🇲🇦", name: "Maroc" },
  { code: "MQ", dialCode: "+596", flag: "🇲🇶", name: "Martinique" },
  { code: "MU", dialCode: "+230", flag: "🇲🇺", name: "Maurice" },
  { code: "MR", dialCode: "+222", flag: "🇲🇷", name: "Mauritanie" },
  { code: "YT", dialCode: "+262", flag: "🇾🇹", name: "Mayotte" },
  { code: "MX", dialCode: "+52", flag: "🇲🇽", name: "Mexique" },
  { code: "FM", dialCode: "+691", flag: "🇫🇲", name: "Micronésie" },
  { code: "MD", dialCode: "+373", flag: "🇲🇩", name: "Moldavie" },
  { code: "MC", dialCode: "+377", flag: "🇲🇨", name: "Monaco" },
  { code: "MN", dialCode: "+976", flag: "🇲🇳", name: "Mongolie" },
  { code: "ME", dialCode: "+382", flag: "🇲🇪", name: "Monténégro" },
  { code: "MS", dialCode: "+1664", flag: "🇲🇸", name: "Montserrat" },
  { code: "MZ", dialCode: "+258", flag: "🇲🇿", name: "Mozambique" },
  { code: "MM", dialCode: "+95", flag: "🇲🇲", name: "Myanmar" },
  { code: "NA", dialCode: "+264", flag: "🇳🇦", name: "Namibie" },
  { code: "NR", dialCode: "+674", flag: "🇳🇷", name: "Nauru" },
  { code: "NP", dialCode: "+977", flag: "🇳🇵", name: "Népal" },
  { code: "NI", dialCode: "+505", flag: "🇳🇮", name: "Nicaragua" },
  { code: "NE", dialCode: "+227", flag: "🇳🇪", name: "Niger" },
  { code: "NG", dialCode: "+234", flag: "🇳🇬", name: "Nigéria" },
  { code: "NU", dialCode: "+683", flag: "🇳🇺", name: "Niue" },
  { code: "NO", dialCode: "+47", flag: "🇳🇴", name: "Norvège" },
  { code: "NC", dialCode: "+687", flag: "🇳🇨", name: "Nouvelle-Calédonie" },
  { code: "NZ", dialCode: "+64", flag: "🇳🇿", name: "Nouvelle-Zélande" },
  { code: "OM", dialCode: "+968", flag: "🇴🇲", name: "Oman" },
  { code: "UG", dialCode: "+256", flag: "🇺🇬", name: "Ouganda" },
  { code: "UZ", dialCode: "+998", flag: "🇺🇿", name: "Ouzbékistan" },
  { code: "PK", dialCode: "+92", flag: "🇵🇰", name: "Pakistan" },
  { code: "PW", dialCode: "+680", flag: "🇵🇼", name: "Palaos" },
  { code: "PS", dialCode: "+970", flag: "🇵🇸", name: "Palestine" },
  { code: "PA", dialCode: "+507", flag: "🇵🇦", name: "Panama" },
  {
    code: "PG",
    dialCode: "+675",
    flag: "🇵🇬",
    name: "Papouasie-Nouvelle-Guinée",
  },
  { code: "PY", dialCode: "+595", flag: "🇵🇾", name: "Paraguay" },
  { code: "NL", dialCode: "+31", flag: "🇳🇱", name: "Pays-Bas" },
  { code: "PE", dialCode: "+51", flag: "🇵🇪", name: "Pérou" },
  { code: "PH", dialCode: "+63", flag: "🇵🇭", name: "Philippines" },
  { code: "PL", dialCode: "+48", flag: "🇵🇱", name: "Pologne" },
  { code: "PF", dialCode: "+689", flag: "🇵🇫", name: "Polynésie française" },
  { code: "PR", dialCode: "+1", flag: "🇵🇷", name: "Porto Rico" },
  { code: "PT", dialCode: "+351", flag: "🇵🇹", name: "Portugal" },
  { code: "QA", dialCode: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "RE", dialCode: "+262", flag: "🇷🇪", name: "La Réunion" },
  { code: "RO", dialCode: "+40", flag: "🇷🇴", name: "Roumanie" },
  { code: "GB", dialCode: "+44", flag: "🇬🇧", name: "Royaume-Uni" },
  { code: "RU", dialCode: "+7", flag: "🇷🇺", name: "Russie" },
  { code: "RW", dialCode: "+250", flag: "🇷🇼", name: "Rwanda" },
  { code: "EH", dialCode: "+212", flag: "🇪🇭", name: "Sahara occidental" },
  { code: "BL", dialCode: "+590", flag: "🇧🇱", name: "Saint-Barthélemy" },
  { code: "KN", dialCode: "+1869", flag: "🇰🇳", name: "Saint-Kitts-et-Nevis" },
  { code: "SM", dialCode: "+378", flag: "🇸🇲", name: "Saint-Marin" },
  { code: "MF", dialCode: "+590", flag: "🇲🇫", name: "Saint-Martin" },
  {
    code: "PM",
    dialCode: "+508",
    flag: "🇵🇲",
    name: "Saint-Pierre-et-Miquelon",
  },
  {
    code: "VC",
    dialCode: "+1784",
    flag: "🇻🇨",
    name: "Saint-Vincent-et-les-Grenadines",
  },
  { code: "SH", dialCode: "+290", flag: "🇸🇭", name: "Sainte-Hélène" },
  { code: "LC", dialCode: "+1758", flag: "🇱🇨", name: "Sainte-Lucie" },
  { code: "SV", dialCode: "+503", flag: "🇸🇻", name: "Salvador" },
  { code: "WS", dialCode: "+685", flag: "🇼🇸", name: "Samoa" },
  { code: "AS", dialCode: "+1684", flag: "🇦🇸", name: "Samoa américaines" },
  { code: "ST", dialCode: "+239", flag: "🇸🇹", name: "Sao Tomé-et-Principe" },
  { code: "SN", dialCode: "+221", flag: "🇸🇳", name: "Sénégal" },
  { code: "RS", dialCode: "+381", flag: "🇷🇸", name: "Serbie" },
  { code: "SC", dialCode: "+248", flag: "🇸🇨", name: "Seychelles" },
  { code: "SL", dialCode: "+232", flag: "🇸🇱", name: "Sierra Leone" },
  { code: "SG", dialCode: "+65", flag: "🇸🇬", name: "Singapour" },
  { code: "SX", dialCode: "+1721", flag: "🇸🇽", name: "Sint Maarten" },
  { code: "SK", dialCode: "+421", flag: "🇸🇰", name: "Slovaquie" },
  { code: "SI", dialCode: "+386", flag: "🇸🇮", name: "Slovénie" },
  { code: "SO", dialCode: "+252", flag: "🇸🇴", name: "Somalie" },
  { code: "SD", dialCode: "+249", flag: "🇸🇩", name: "Soudan" },
  { code: "SS", dialCode: "+211", flag: "🇸🇸", name: "Soudan du Sud" },
  { code: "LK", dialCode: "+94", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "SE", dialCode: "+46", flag: "🇸🇪", name: "Suède" },
  { code: "CH", dialCode: "+41", flag: "🇨🇭", name: "Suisse" },
  { code: "SR", dialCode: "+597", flag: "🇸🇷", name: "Suriname" },
  { code: "SJ", dialCode: "+47", flag: "🇸🇯", name: "Svalbard et Jan Mayen" },
  { code: "SY", dialCode: "+963", flag: "🇸🇾", name: "Syrie" },
  { code: "TJ", dialCode: "+992", flag: "🇹🇯", name: "Tadjikistan" },
  { code: "TW", dialCode: "+886", flag: "🇹🇼", name: "Taïwan" },
  { code: "TZ", dialCode: "+255", flag: "🇹🇿", name: "Tanzanie" },
  { code: "TD", dialCode: "+235", flag: "🇹🇩", name: "Tchad" },
  { code: "CZ", dialCode: "+420", flag: "🇨🇿", name: "Tchéquie" },
  {
    code: "TF",
    dialCode: "+262",
    flag: "🇹🇫",
    name: "Terres australes françaises",
  },
  { code: "TH", dialCode: "+66", flag: "🇹🇭", name: "Thaïlande" },
  { code: "TL", dialCode: "+670", flag: "🇹🇱", name: "Timor oriental" },
  { code: "TG", dialCode: "+228", flag: "🇹🇬", name: "Togo" },
  { code: "TK", dialCode: "+690", flag: "🇹🇰", name: "Tokelau" },
  { code: "TO", dialCode: "+676", flag: "🇹🇴", name: "Tonga" },
  { code: "TT", dialCode: "+1868", flag: "🇹🇹", name: "Trinité-et-Tobago" },
  { code: "TN", dialCode: "+216", flag: "🇹🇳", name: "Tunisie" },
  { code: "TM", dialCode: "+993", flag: "🇹🇲", name: "Turkménistan" },
  {
    code: "TC",
    dialCode: "+1649",
    flag: "🇹🇨",
    name: "Îles Turques-et-Caïques",
  },
  { code: "TR", dialCode: "+90", flag: "🇹🇷", name: "Turquie" },
  { code: "TV", dialCode: "+688", flag: "🇹🇻", name: "Tuvalu" },
  { code: "UA", dialCode: "+380", flag: "🇺🇦", name: "Ukraine" },
  { code: "UY", dialCode: "+598", flag: "🇺🇾", name: "Uruguay" },
  { code: "VU", dialCode: "+678", flag: "🇻🇺", name: "Vanuatu" },
  { code: "VA", dialCode: "+379", flag: "🇻🇦", name: "Vatican" },
  { code: "VE", dialCode: "+58", flag: "🇻🇪", name: "Venezuela" },
  { code: "VN", dialCode: "+84", flag: "🇻🇳", name: "Viêt Nam" },
  { code: "WF", dialCode: "+681", flag: "🇼🇫", name: "Wallis-et-Futuna" },
  { code: "YE", dialCode: "+967", flag: "🇾🇪", name: "Yémen" },
  { code: "ZM", dialCode: "+260", flag: "🇿🇲", name: "Zambie" },
  { code: "ZW", dialCode: "+263", flag: "🇿🇼", name: "Zimbabwe" },
];

export function PhoneInput({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  placeholder,
  error,
  required = false,
}: PhoneInputProps) {
  const selectedCountry = COUNTRIES.find((c) => c.dialCode === countryCode);

  return (
    <div>
      <div
        className={`flex items-center bg-white rounded-[10px] overflow-hidden ${
          error ? "ring-2 ring-inset ring-red" : ""
        }`}
      >
        {/* Country Code Selector */}
        <div className="relative flex-shrink-0">
          <select
            name="countryCode"
            value={countryCode}
            onChange={onCountryCodeChange}
            className="bg-transparent text-black px-3 py-2 text-base 2xl:text-lg appearance-none cursor-pointer focus:outline-none border-r border-gray-300"
            style={{
              paddingRight: "2rem",
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.25rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.25em 1.25em",
            }}
          >
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.dialCode}>
                {country.flag} {country.dialCode}
              </option>
            ))}
          </select>
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          name="phone"
          value={phoneNumber}
          onChange={onPhoneNumberChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-black placeholder-black px-4 py-2 text-base 2xl:text-lg focus:outline-none"
          required={required}
        />
      </div>
      {error && (
        <p className="text-red text-sm 2xl:text-base mt-1 font-poppins">
          {error}
        </p>
      )}
    </div>
  );
}
