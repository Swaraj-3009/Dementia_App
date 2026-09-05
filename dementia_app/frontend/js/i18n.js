(() => {
    const translations = {
        en: {
            appName: "Cognicare", caregiverDashboard: "Caregiver dashboard", patientPortal: "Patient portal",
            caregiver: "Caregiver", patient: "Patient", logout: "Logout", language: "Language",
            patients: "Patients", medications: "Medications", reminders: "Reminders", emergency: "Emergency",
            brainGames: "Brain games", performance: "Cognitive performance", careTeam: "Care team",
            signIn: "Sign in", createAccount: "Create caregiver account", accountHelp: "Choose your account type to access your care space.",
            usernameOrEmail: "Username or email", password: "Password", login: "Login", register: "Create account",
            myCarePlan: "My care plan", carePlanHelp: "Review reminders, medicines, and your emergency contact.",
            callContact: "Call emergency contact", addPatient: "Add a patient", addMedication: "Add a medication", addReminder: "Add a reminder",
            configureContact: "Add or update an emergency contact", productionNotice: "Cognicare supports care coordination and does not provide medical advice."
        },
        hi: {
            appName: "कॉग्निकेयर", caregiverDashboard: "देखभालकर्ता डैशबोर्ड", patientPortal: "रोगी पोर्टल", caregiver: "देखभालकर्ता", patient: "रोगी", logout: "लॉग आउट", language: "भाषा", patients: "रोगी", medications: "दवाइयाँ", reminders: "रिमाइंडर", emergency: "आपातकाल", brainGames: "मस्तिष्क खेल", performance: "संज्ञानात्मक प्रदर्शन", careTeam: "देखभाल टीम", signIn: "साइन इन", createAccount: "देखभालकर्ता खाता बनाएँ", accountHelp: "अपने देखभाल स्थान तक पहुँचने के लिए खाता प्रकार चुनें।", usernameOrEmail: "उपयोगकर्ता नाम या ईमेल", password: "पासवर्ड", login: "लॉग इन", register: "खाता बनाएँ", myCarePlan: "मेरी देखभाल योजना", carePlanHelp: "रिमाइंडर, दवाइयाँ और आपातकालीन संपर्क देखें।", callContact: "आपातकालीन संपर्क को कॉल करें", addPatient: "रोगी जोड़ें", addMedication: "दवा जोड़ें", addReminder: "रिमाइंडर जोड़ें", configureContact: "आपातकालीन संपर्क जोड़ें या अपडेट करें", productionNotice: "कॉग्निकेयर देखभाल समन्वय में सहायता करता है और चिकित्सा सलाह नहीं देता।"
        },
        bn: {
            appName: "কগনিকেয়ার", caregiverDashboard: "পরিচর্যাকারী ড্যাশবোর্ড", patientPortal: "রোগী পোর্টাল", caregiver: "পরিচর্যাকারী", patient: "রোগী", logout: "লগ আউট", language: "ভাষা", patients: "রোগী", medications: "ওষুধ", reminders: "রিমাইন্ডার", emergency: "জরুরি", brainGames: "মস্তিষ্কের খেলা", performance: "জ্ঞানীয় কার্যকারিতা", careTeam: "পরিচর্যা দল", signIn: "সাইন ইন", createAccount: "পরিচর্যাকারী অ্যাকাউন্ট তৈরি করুন", accountHelp: "আপনার পরিচর্যা স্থানে যেতে অ্যাকাউন্টের ধরন নির্বাচন করুন।", usernameOrEmail: "ব্যবহারকারীর নাম বা ইমেল", password: "পাসওয়ার্ড", login: "লগ ইন", register: "অ্যাকাউন্ট তৈরি করুন", myCarePlan: "আমার পরিচর্যা পরিকল্পনা", carePlanHelp: "রিমাইন্ডার, ওষুধ ও জরুরি যোগাযোগ দেখুন।", callContact: "জরুরি যোগাযোগে কল করুন", addPatient: "রোগী যোগ করুন", addMedication: "ওষুধ যোগ করুন", addReminder: "রিমাইন্ডার যোগ করুন", configureContact: "জরুরি যোগাযোগ যোগ বা হালনাগাদ করুন", productionNotice: "কগনিকেয়ার পরিচর্যা সমন্বয়ে সহায়তা করে এবং চিকিৎসা পরামর্শ দেয় না।"
        },
        as: { appName: "কগনিকেয়াৰ", caregiverDashboard: "যত্নকাৰী ডেশ্বব'ৰ্ড", patientPortal: "ৰোগী প'ৰ্টেল", caregiver: "যত্নকাৰী", patient: "ৰোগী", logout: "লগ আউট", language: "ভাষা", patients: "ৰোগী", medications: "ঔষধ", reminders: "সোঁৱৰণী", emergency: "জৰুৰীকালীন", brainGames: "মগজুৰ খেল", performance: "জ্ঞানীয় কাৰ্যক্ষমতা", careTeam: "যত্ন দল", signIn: "ছাইন ইন", createAccount: "যত্নকাৰী একাউণ্ট তৈয়াৰ কৰক", accountHelp: "যত্ন স্থানত প্ৰৱেশ কৰিবলৈ একাউণ্টৰ ধৰণ বাছক।", usernameOrEmail: "ব্যৱহাৰকাৰী নাম বা ইমেইল", password: "পাছৱৰ্ড", login: "লগ ইন", register: "একাউণ্ট তৈয়াৰ কৰক", myCarePlan: "মোৰ যত্ন পৰিকল্পনা", carePlanHelp: "সোঁৱৰণী, ঔষধ আৰু জৰুৰী যোগাযোগ চাওক।", callContact: "জৰুৰী যোগাযোগলৈ কল কৰক", addPatient: "ৰোগী যোগ কৰক", addMedication: "ঔষধ যোগ কৰক", addReminder: "সোঁৱৰণী যোগ কৰক", configureContact: "জৰুৰী যোগাযোগ যোগ বা আপডেট কৰক", productionNotice: "কগনিকেয়াৰে যত্ন সমন্বয়ত সহায় কৰে; ই চিকিৎসা পৰামৰ্শ নিদিয়ে।" },
        ne: { appName: "कग्निकेयर", caregiverDashboard: "हेरचाहकर्ता ड्यासबोर्ड", patientPortal: "बिरामी पोर्टल", caregiver: "हेरचाहकर्ता", patient: "बिरामी", logout: "लग आउट", language: "भाषा", patients: "बिरामीहरू", medications: "औषधि", reminders: "स्मरणहरू", emergency: "आपतकाल", brainGames: "मस्तिष्क खेल", performance: "संज्ञानात्मक प्रदर्शन", careTeam: "हेरचाह टोली", signIn: "साइन इन", createAccount: "हेरचाहकर्ता खाता बनाउनुहोस्", accountHelp: "आफ्नो हेरचाह स्थानमा जान खाताको प्रकार छान्नुहोस्।", usernameOrEmail: "प्रयोगकर्ता नाम वा इमेल", password: "पासवर्ड", login: "लग इन", register: "खाता बनाउनुहोस्", myCarePlan: "मेरो हेरचाह योजना", carePlanHelp: "स्मरण, औषधि र आपतकालीन सम्पर्क हेर्नुहोस्।", callContact: "आपतकालीन सम्पर्कलाई कल गर्नुहोस्", addPatient: "बिरामी थप्नुहोस्", addMedication: "औषधि थप्नुहोस्", addReminder: "स्मरण थप्नुहोस्", configureContact: "आपतकालीन सम्पर्क थप्नुहोस् वा अद्यावधिक गर्नुहोस्", productionNotice: "कग्निकेयरले हेरचाह समन्वयमा सहयोग गर्छ र चिकित्सा सल्लाह दिँदैन।" },
        mni: { appName: "Cognicare", caregiverDashboard: "Caregiver dashboard", patientPortal: "Patient portal", caregiver: "Caregiver", patient: "Patient", logout: "Log out", language: "Language", patients: "Patients", medications: "Medicines", reminders: "Reminders", emergency: "Emergency", brainGames: "Brain games", performance: "Cognitive performance", careTeam: "Care team", signIn: "Sign in", createAccount: "Create caregiver account", accountHelp: "Care space access type khallou.", usernameOrEmail: "Username nattraga email", password: "Password", login: "Log in", register: "Account sembiyu", myCarePlan: "Ei gi care plan", carePlanHelp: "Reminder, medicine amasung emergency contact yeng-u.", callContact: "Emergency contact da call tou", addPatient: "Patient hap-u", addMedication: "Medicine hap-u", addReminder: "Reminder hap-u", configureContact: "Emergency contact hap-u nattraga update tou", productionNotice: "Cognicare na care coordination da mateng pang-i; masi medical advice nattre." }
    };

    function applyLanguage(language) {
        const dictionary = translations[language] || translations.en;
        document.documentElement.lang = language;
        document.querySelectorAll("[data-i18n]").forEach((element) => {
            const value = dictionary[element.dataset.i18n] || translations.en[element.dataset.i18n];
            if (value) element.textContent = value;
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
            const value = dictionary[element.dataset.i18nPlaceholder] || translations.en[element.dataset.i18nPlaceholder];
            if (value) element.placeholder = value;
        });
        document.title = `${dictionary.appName || "Cognicare"} · ${document.body.dataset.pageTitle || "Care"}`;
        localStorage.setItem("cognicare-language", language);
        document.querySelectorAll(".language-select").forEach((select) => { select.value = language; });
        window.dispatchEvent(new CustomEvent("cognicare-language-change", { detail: { language, dictionary } }));
    }

    window.CognicareI18n = { t: (key) => (translations[localStorage.getItem("cognicare-language") || "en"] || translations.en)[key] || translations.en[key] || key, applyLanguage };
    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".language-select").forEach((select) => select.addEventListener("change", () => applyLanguage(select.value)));
        applyLanguage(localStorage.getItem("cognicare-language") || "en");
    });
})();
