-- PetPass manual import for Render Postgres
-- This recreates the same tables/data from db/petpass_dump.sql.
-- Run this in a SQL query tool connected to the Render petpass database.

DROP TABLE IF EXISTS public.vaccinations;
DROP TABLE IF EXISTS public.pets;
DROP TABLE IF EXISTS public.users;

CREATE TABLE public.users (
    id bigint NOT NULL,
    full_name character varying(100),
    email character varying(255) NOT NULL,
    phone character varying(50),
    address character varying(255),
    date_of_birth date,
    passport_number character varying(50),
    google_id character varying(255),
    googleid character varying(255),
    photo text,
    admin boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.pets (
    id bigint NOT NULL,
    owner_user_id bigint,
    name character varying(120) NOT NULL,
    species character varying(80) NOT NULL,
    breed character varying(150),
    sex character varying(50),
    color_markings character varying(200),
    date_of_birth date,
    country_of_birth character(2),
    microchip_number character varying(50),
    microchip_implant_date date,
    microchip_implant_location character varying(200),
    tattoo_number character varying(50),
    passport_number character varying(50),
    country_of_issue character(2) DEFAULT 'DK'::bpchar NOT NULL,
    issue_date date DEFAULT CURRENT_DATE NOT NULL,
    issuing_authority character varying(200),
    current_status character varying(50) DEFAULT 'Active'::character varying NOT NULL,
    photo_url text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.pets ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.pets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.vaccinations (
    id bigint NOT NULL,
    pet_id bigint NOT NULL,
    vaccine_name character varying(120) NOT NULL,
    date_administered date NOT NULL,
    next_due date,
    veterinarian character varying(200),
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.vaccinations ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.vaccinations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Data for Name: pets; Type: TABLE DATA; Schema: public; Owner: petpass
--

COPY public.pets (id, owner_user_id, name, species, breed, sex, color_markings, date_of_birth, country_of_birth, microchip_number, microchip_implant_date, microchip_implant_location, tattoo_number, passport_number, country_of_issue, issue_date, issuing_authority, current_status, photo_url, created_at, updated_at) FROM stdin;
1	1	Nora	Dog	Golden Retriever	Female	\N	2025-09-01	DK	900164784001455	\N	\N	\N	PP000001	DK	2026-05-09	\N	Active	\N	2026-05-09 16:02:06.029527	2026-05-09 16:02:06.029527
98	29	Finn	Cat	Somali	Female	Cinnamon tail tip	2020-02-14	IE	D33MC001	\N	\N	\N	D33-PP001	IE	2025-01-12	Nordic Vet Group	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
99	30	Boncuk	Dog	Vizsla	Male	Copper chest patch	2019-08-03	TR	D33MC002	\N	\N	\N	D33-PP002	TR	2025-02-01	Harbor Animal Clinic	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
100	31	Sora	Parrot	Caique	Male	Green wing feathers	2021-06-19	JP	D33MC003	\N	\N	\N	D33-PP003	JP	2025-02-18	City Aviary Care	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
101	32	Luna	Dog	Samoyed	Female	Snow white coat	2018-12-11	IT	D33MC004	\N	\N	\N	D33-PP004	IT	2025-02-28	North Shore Vets	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
102	33	Bamse	Dog	Nova Scotia Duck Tolling Retriever	Male	Amber ears	2022-03-09	NO	D33MC005	\N	\N	\N	D33-PP005	NO	2025-03-03	Maple Pet Health	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
103	34	Canela	Cat	Turkish Van	Female	Ginger crown mark	2021-04-17	ES	D33MC006	\N	\N	\N	D33-PP006	ES	2025-03-06	Old Town Vet House	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
104	35	Birk	Rabbit	Lionhead	Male	Grey mane	2023-01-30	DK	D33MC007	\N	\N	\N	D33-PP007	DK	2025-03-08	Garden Pet Practice	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
105	36	Sisu	Dog	Basenji	Female	White paws	2020-10-07	FI	D33MC008	\N	\N	\N	D33-PP008	FI	2025-03-11	Canal Vet Center	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
106	29	Murphy	Cat	Devon Rex	Male	Cream whisker stripe	2019-11-29	IE	D33MC009	\N	\N	\N	D33-PP009	IE	2025-03-15	Nordic Vet Group	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
107	30	Duman	Dog	Weimaraner	Female	Silver blaze	2017-05-21	TR	D33MC010	\N	\N	\N	D33-PP010	TR	2025-03-18	Harbor Animal Clinic	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
108	31	Yuki	Ferret	Standard Ferret	Male	Mask face	2022-09-13	JP	D33MC011	\N	\N	\N	D33-PP011	JP	2025-03-22	City Aviary Care	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
109	32	Stella	Dog	Keeshond	Female	Black saddle coat	2018-01-05	IT	D33MC012	\N	\N	\N	D33-PP012	IT	2025-03-26	North Shore Vets	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
110	33	Tassen	Dog	Miniature Pinscher	Male	Rust eyebrows	2021-07-14	NO	D33MC013	\N	\N	\N	D33-PP013	NO	2025-03-29	Maple Pet Health	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
111	34	Lola	Cat	Japanese Bobtail	Female	Black tail pom	2020-06-06	ES	D33MC014	\N	\N	\N	D33-PP014	ES	2025-04-02	Old Town Vet House	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
112	35	Mille	Dog	Border Terrier	Male	Wiry tan muzzle	2019-09-24	IE	D33MC015	\N	\N	\N	D33-PP015	DK	2025-04-04	Garden Pet Practice	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
113	36	Helmi	Goat	Pygmy Goat	Female	White knee spots	2022-04-27	FI	D33MC016	\N	\N	\N	D33-PP016	FI	2025-04-07	Canal Vet Center	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
114	29	Bran	Dog	Australian Kelpie	Female	Black and tan coat	2021-08-30	IE	D33MC017	\N	\N	\N	D33-PP017	IE	2025-04-10	Nordic Vet Group	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
115	30	Fistik	Cat	Chartreux	Male	Blue-grey fur	2018-03-16	TR	D33MC018	\N	\N	\N	D33-PP018	TR	2025-04-12	Harbor Animal Clinic	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
116	31	Hana	Dog	Italian Greyhound	Female	Rose nose	2022-02-02	JP	D33MC019	\N	\N	\N	D33-PP019	JP	2025-04-15	City Aviary Care	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
117	32	Pepe	Dog	Belgian Laekenois	Male	Tousled sandy coat	2020-11-01	IT	D33MC020	\N	\N	\N	D33-PP020	IT	2025-04-18	North Shore Vets	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
118	33	Lykke	Cat	Havana Brown	Female	Mahogany coat	2019-12-07	NO	D33MC021	\N	\N	\N	D33-PP021	NO	2025-04-20	Maple Pet Health	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
119	34	Rio	Dog	Lagotto Romagnolo	Male	Curly cream coat	2021-01-18	ES	D33MC022	\N	\N	\N	D33-PP022	ES	2025-04-22	Old Town Vet House	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
120	35	Otto	Cat	Burmilla	Female	Silver shaded fur	2023-02-09	DK	D33MC023	\N	\N	\N	D33-PP023	DK	2025-04-24	Garden Pet Practice	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
121	36	Myrsky	Dog	Finnish Spitz	Male	Fox-red tail	2020-08-08	FI	D33MC024	\N	\N	\N	D33-PP024	FI	2025-04-26	Canal Vet Center	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
122	29	Roisin	Chicken	Silkie	Female	Blue feather puff	2024-03-05	IE	D33MC025	\N	\N	\N	D33-PP025	IE	2025-04-28	Nordic Vet Group	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
123	30	Minik	Dog	Norwegian Buhund	Male	Wheat coat	2019-04-14	TR	D33MC026	\N	\N	\N	D33-PP026	TR	2025-05-01	Harbor Animal Clinic	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
124	31	Kiko	Cat	LaPerm	Female	Soft curly coat	2022-07-07	JP	D33MC027	\N	\N	\N	D33-PP027	JP	2025-05-03	City Aviary Care	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
125	32	Briciola	Dog	Bearded Collie	Female	Grey beard fringe	2018-06-01	IT	D33MC028	\N	\N	\N	D33-PP028	IT	2025-05-05	North Shore Vets	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
126	33	Snofnugg	Dog	Eurasier	Male	Smoky sable fur	2021-11-23	NO	D33MC029	\N	\N	\N	D33-PP029	NO	2025-05-06	Maple Pet Health	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
127	34	Nico	Cat	Tonkinese	Female	Aqua eyes	2020-09-19	ES	D33MC030	\N	\N	\N	D33-PP030	ES	2025-05-07	Old Town Vet House	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
128	35	Alma	Rabbit	Mini Rex	Female	Velvet chocolate ears	2023-05-12	DK	D33MC031	\N	\N	\N	D33-PP031	DK	2025-05-08	Garden Pet Practice	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
129	36	Nuppu	Dog	Spanish Water Dog	Male	Dark curly coat	2020-01-25	FI	D33MC032	\N	\N	\N	D33-PP032	FI	2025-05-09	Canal Vet Center	Active	\N	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: petpass
--

COPY public.users (id, full_name, email, phone, address, date_of_birth, passport_number, google_id, googleid, photo, admin, created_at, updated_at) FROM stdin;
1	Bayram Erdem	bayram9erdem@gmail.com	4561767312	Copenhagen, Denmark	1990-01-01	USR0001	\N	\N	\N	t	2026-05-09 16:02:06.018214	2026-05-09 16:02:06.018214
3	Bayram Erdem	erdem1bayram@gmail.com	\N	\N	\N	\N	\N	110694820831450937280	https://lh3.googleusercontent.com/a/ACg8ocKJWdeXWgZhi-kTNgAlm8qsINWFygFpaAMYMoTu_RHbVAhbMr8=s96-c	f	2026-05-13 18:32:22.455334	2026-05-13 18:39:02.208006
29	Siobhan O'Sullivan	siobhan.osullivan@petpass-demo.local	+353 85 110 0001	Cork, Ireland	1991-04-16	D33USR001	\N	\N	\N	f	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
30	Emre Yildiz	emre.yildiz@petpass-demo.local	+90 532 110 0002	Izmir, Turkey	1988-11-02	D33USR002	\N	\N	\N	f	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
31	Aiko Tanaka	aiko.tanaka@petpass-demo.local	+81 90 1100 0003	Yokohama, Japan	1993-01-27	D33USR003	\N	\N	\N	f	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
32	Giulia Romano	giulia.romano@petpass-demo.local	+39 331 110 0004	Bologna, Italy	1986-07-09	D33USR004	\N	\N	\N	f	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
33	Ingrid Solheim	ingrid.solheim@petpass-demo.local	+47 412 11 005	Bergen, Norway	1994-09-12	D33USR005	\N	\N	\N	f	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
34	Javier Navarro	javier.navarro@petpass-demo.local	+34 611 100 006	Valencia, Spain	1990-03-03	D33USR006	\N	\N	\N	f	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
35	Freja Mikkelsen	freja.mikkelsen@petpass-demo.local	+45 31 11 00 07	Aarhus, Denmark	1996-05-22	D33USR007	\N	\N	\N	f	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
36	Aino Korhonen	aino.korhonen@petpass-demo.local	+358 44 110 0008	Turku, Finland	1989-12-14	D33USR008	\N	\N	\N	f	2026-05-13 19:22:24.052191	2026-05-13 19:22:24.052191
\.


--
-- Data for Name: vaccinations; Type: TABLE DATA; Schema: public; Owner: petpass
--

COPY public.vaccinations (id, pet_id, vaccine_name, date_administered, next_due, veterinarian, notes, created_at, updated_at) FROM stdin;
1	1	Rabies	2026-04-09	2027-04-09	Bayram Erdem	Local-only seed record for development.	2026-05-09 16:02:06.03586	2026-05-09 16:02:06.03586
\.

SELECT pg_catalog.setval('public.users_id_seq', 36, true);
SELECT pg_catalog.setval('public.pets_id_seq', 129, true);
SELECT pg_catalog.setval('public.vaccinations_id_seq', 1, true);

--
-- Name: pets pets_microchip_number_key; Type: CONSTRAINT; Schema: public; Owner: petpass
--

ALTER TABLE ONLY public.pets
    ADD CONSTRAINT pets_microchip_number_key UNIQUE (microchip_number);


--
-- Name: pets pets_passport_number_key; Type: CONSTRAINT; Schema: public; Owner: petpass
--

ALTER TABLE ONLY public.pets
    ADD CONSTRAINT pets_passport_number_key UNIQUE (passport_number);


--
-- Name: pets pets_pkey; Type: CONSTRAINT; Schema: public; Owner: petpass
--

ALTER TABLE ONLY public.pets
    ADD CONSTRAINT pets_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: petpass
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_google_id_key; Type: CONSTRAINT; Schema: public; Owner: petpass
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_google_id_key UNIQUE (google_id);


--
-- Name: users users_googleid_key; Type: CONSTRAINT; Schema: public; Owner: petpass
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_googleid_key UNIQUE (googleid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: petpass
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vaccinations vaccinations_pkey; Type: CONSTRAINT; Schema: public; Owner: petpass
--

ALTER TABLE ONLY public.vaccinations
    ADD CONSTRAINT vaccinations_pkey PRIMARY KEY (id);


--
-- Name: pets pets_owner_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: petpass
--

ALTER TABLE ONLY public.pets
    ADD CONSTRAINT pets_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: vaccinations vaccinations_pet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: petpass
--

ALTER TABLE ONLY public.vaccinations
    ADD CONSTRAINT vaccinations_pet_id_fkey FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;

SELECT 'users' AS table_name, COUNT(*) AS row_count FROM public.users
UNION ALL
SELECT 'pets', COUNT(*) FROM public.pets
UNION ALL
SELECT 'vaccinations', COUNT(*) FROM public.vaccinations
ORDER BY table_name;
