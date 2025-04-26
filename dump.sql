

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."completed_days" (
    "id" integer NOT NULL,
    "user_id" "text" NOT NULL,
    "workout_id" integer NOT NULL,
    "points_earned" integer NOT NULL,
    "completed_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."completed_days" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."completed_days_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."completed_days_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."completed_days_id_seq" OWNED BY "public"."completed_days"."id";



CREATE TABLE IF NOT EXISTS "public"."completed_exercises" (
    "id" integer NOT NULL,
    "user_id" "text" NOT NULL,
    "exercise_id" integer NOT NULL,
    "points_earned" integer NOT NULL,
    "completed_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."completed_exercises" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."completed_exercises_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."completed_exercises_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."completed_exercises_id_seq" OWNED BY "public"."completed_exercises"."id";



CREATE TABLE IF NOT EXISTS "public"."completed_weeks" (
    "id" integer NOT NULL,
    "user_id" "text" NOT NULL,
    "week_start_date" "date" NOT NULL,
    "points_earned" integer NOT NULL,
    "completed_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."completed_weeks" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."completed_weeks_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."completed_weeks_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."completed_weeks_id_seq" OWNED BY "public"."completed_weeks"."id";



CREATE TABLE IF NOT EXISTS "public"."exercise_progress" (
    "id" integer NOT NULL,
    "user_id" "text" NOT NULL,
    "exercise_id" integer,
    "date" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "weight" numeric,
    "reps" integer,
    "duration" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."exercise_progress" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."exercise_progress_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."exercise_progress_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."exercise_progress_id_seq" OWNED BY "public"."exercise_progress"."id";



CREATE TABLE IF NOT EXISTS "public"."exercise_sets" (
    "id" integer NOT NULL,
    "exercise_id" integer,
    "set_number" integer NOT NULL,
    "reps" "text",
    "weight" "text",
    "duration" "text",
    "rest_time" integer,
    "is_completed" boolean DEFAULT false,
    "points" integer DEFAULT 0,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."exercise_sets" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."exercise_sets_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."exercise_sets_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."exercise_sets_id_seq" OWNED BY "public"."exercise_sets"."id";



CREATE TABLE IF NOT EXISTS "public"."exercises" (
    "id" integer NOT NULL,
    "section_id" integer,
    "name" "text" NOT NULL,
    "sets" integer,
    "reps" "text",
    "duration" "text",
    "weight" "text",
    "video_url" "text",
    "notes" "text",
    "rest_time" integer,
    "is_completed" boolean DEFAULT false,
    "description" "text",
    "points" integer DEFAULT 0,
    "order_index" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."exercises" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."exercises_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."exercises_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."exercises_id_seq" OWNED BY "public"."exercises"."id";



CREATE TABLE IF NOT EXISTS "public"."rewards" (
    "id" integer NOT NULL,
    "type" "text" NOT NULL,
    "points" integer NOT NULL,
    "description" "text"
);


ALTER TABLE "public"."rewards" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."rewards_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."rewards_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."rewards_id_seq" OWNED BY "public"."rewards"."id";



CREATE TABLE IF NOT EXISTS "public"."sections" (
    "id" integer NOT NULL,
    "workout_id" integer,
    "title" "text" NOT NULL,
    "description" "text"
);


ALTER TABLE "public"."sections" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."sections_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."sections_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."sections_id_seq" OWNED BY "public"."sections"."id";



CREATE TABLE IF NOT EXISTS "public"."user_progress" (
    "id" integer NOT NULL,
    "user_id" "text" NOT NULL,
    "points" integer DEFAULT 0,
    "completed_exercises" integer DEFAULT 0,
    "completed_days" integer DEFAULT 0,
    "completed_weeks" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."user_progress" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."user_progress_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."user_progress_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."user_progress_id_seq" OWNED BY "public"."user_progress"."id";



CREATE TABLE IF NOT EXISTS "public"."workout_sections" (
    "id" integer NOT NULL,
    "workout_id" integer,
    "title" "text" NOT NULL,
    "description" "text",
    "order_index" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."workout_sections" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."workout_sections_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."workout_sections_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."workout_sections_id_seq" OWNED BY "public"."workout_sections"."id";



CREATE TABLE IF NOT EXISTS "public"."workouts" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "day_trigger" "text" NOT NULL,
    "user_name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."workouts" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."workouts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."workouts_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."workouts_id_seq" OWNED BY "public"."workouts"."id";



ALTER TABLE ONLY "public"."completed_days" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."completed_days_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."completed_exercises" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."completed_exercises_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."completed_weeks" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."completed_weeks_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."exercise_progress" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."exercise_progress_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."exercise_sets" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."exercise_sets_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."exercises" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."exercises_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."rewards" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."rewards_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."sections" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."sections_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."user_progress" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."user_progress_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."workout_sections" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."workout_sections_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."workouts" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."workouts_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."completed_days"
    ADD CONSTRAINT "completed_days_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."completed_exercises"
    ADD CONSTRAINT "completed_exercises_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."completed_weeks"
    ADD CONSTRAINT "completed_weeks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exercise_progress"
    ADD CONSTRAINT "exercise_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exercise_sets"
    ADD CONSTRAINT "exercise_sets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exercises"
    ADD CONSTRAINT "exercises_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rewards"
    ADD CONSTRAINT "rewards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sections"
    ADD CONSTRAINT "sections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_progress"
    ADD CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workout_sections"
    ADD CONSTRAINT "workout_sections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workouts"
    ADD CONSTRAINT "workouts_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_exercise_progress_exercise_id" ON "public"."exercise_progress" USING "btree" ("exercise_id");



CREATE INDEX "idx_exercise_progress_user_id" ON "public"."exercise_progress" USING "btree" ("user_id");



CREATE INDEX "idx_exercise_sets_exercise_id" ON "public"."exercise_sets" USING "btree" ("exercise_id");



CREATE INDEX "idx_exercises_section_id" ON "public"."exercises" USING "btree" ("section_id");



CREATE INDEX "idx_sections_title" ON "public"."sections" USING "btree" ("title");



CREATE INDEX "idx_sections_workout_id" ON "public"."sections" USING "btree" ("workout_id");



CREATE INDEX "idx_user_progress_user_id" ON "public"."user_progress" USING "btree" ("user_id");



CREATE INDEX "idx_workout_sections_workout_id" ON "public"."workout_sections" USING "btree" ("workout_id");



CREATE INDEX "idx_workouts_user_name" ON "public"."workouts" USING "btree" ("user_name");



ALTER TABLE ONLY "public"."exercise_progress"
    ADD CONSTRAINT "exercise_progress_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exercise_sets"
    ADD CONSTRAINT "exercise_sets_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exercises"
    ADD CONSTRAINT "exercises_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."workout_sections"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_sections"
    ADD CONSTRAINT "workout_sections_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE CASCADE;



CREATE POLICY "Users can insert their own completed days" ON "public"."completed_days" FOR INSERT WITH CHECK ((("auth"."uid"())::"text" = "user_id"));



CREATE POLICY "Users can insert their own completed exercises" ON "public"."completed_exercises" FOR INSERT WITH CHECK ((("auth"."uid"())::"text" = "user_id"));



CREATE POLICY "Users can insert their own completed weeks" ON "public"."completed_weeks" FOR INSERT WITH CHECK ((("auth"."uid"())::"text" = "user_id"));



CREATE POLICY "Users can insert their own exercise progress" ON "public"."exercise_progress" FOR INSERT WITH CHECK ((("auth"."uid"())::"text" = "user_id"));



CREATE POLICY "Users can insert their own progress" ON "public"."user_progress" FOR INSERT WITH CHECK ((("auth"."uid"())::"text" = "user_id"));



CREATE POLICY "Users can update their own exercise progress" ON "public"."exercise_progress" FOR UPDATE USING ((("auth"."uid"())::"text" = "user_id"));



CREATE POLICY "Users can update their own progress" ON "public"."user_progress" FOR UPDATE USING ((("auth"."uid"())::"text" = "user_id"));



CREATE POLICY "Users can view their own completed days" ON "public"."completed_days" FOR SELECT USING ((("auth"."uid"())::"text" = "user_id"));



CREATE POLICY "Users can view their own completed exercises" ON "public"."completed_exercises" FOR SELECT USING ((("auth"."uid"())::"text" = "user_id"));



CREATE POLICY "Users can view their own completed weeks" ON "public"."completed_weeks" FOR SELECT USING ((("auth"."uid"())::"text" = "user_id"));



CREATE POLICY "Users can view their own exercise progress" ON "public"."exercise_progress" FOR SELECT USING ((("auth"."uid"())::"text" = "user_id"));



CREATE POLICY "Users can view their own exercise sets" ON "public"."exercise_sets" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (("public"."exercises"
     JOIN "public"."workout_sections" ON (("workout_sections"."id" = "exercises"."section_id")))
     JOIN "public"."workouts" ON (("workouts"."id" = "workout_sections"."workout_id")))
  WHERE (("exercises"."id" = "exercise_sets"."exercise_id") AND ("workouts"."user_name" = ("auth"."uid"())::"text")))));



CREATE POLICY "Users can view their own exercises" ON "public"."exercises" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."workout_sections"
     JOIN "public"."workouts" ON (("workouts"."id" = "workout_sections"."workout_id")))
  WHERE (("workout_sections"."id" = "exercises"."section_id") AND ("workouts"."user_name" = ("auth"."uid"())::"text")))));



CREATE POLICY "Users can view their own progress" ON "public"."user_progress" FOR SELECT USING ((("auth"."uid"())::"text" = "user_id"));



CREATE POLICY "Users can view their own sections" ON "public"."workout_sections" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."workouts"
  WHERE (("workouts"."id" = "workout_sections"."workout_id") AND ("workouts"."user_name" = ("auth"."uid"())::"text")))));



CREATE POLICY "Users can view their own workouts" ON "public"."workouts" FOR SELECT USING ((("auth"."uid"())::"text" = "user_name"));



ALTER TABLE "public"."completed_days" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."completed_exercises" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."completed_weeks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercise_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercise_sets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercises" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workout_sections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workouts" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";











































































































































































GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."completed_days" TO "anon";
GRANT ALL ON TABLE "public"."completed_days" TO "authenticated";
GRANT ALL ON TABLE "public"."completed_days" TO "service_role";



GRANT ALL ON SEQUENCE "public"."completed_days_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."completed_days_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."completed_days_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."completed_exercises" TO "anon";
GRANT ALL ON TABLE "public"."completed_exercises" TO "authenticated";
GRANT ALL ON TABLE "public"."completed_exercises" TO "service_role";



GRANT ALL ON SEQUENCE "public"."completed_exercises_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."completed_exercises_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."completed_exercises_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."completed_weeks" TO "anon";
GRANT ALL ON TABLE "public"."completed_weeks" TO "authenticated";
GRANT ALL ON TABLE "public"."completed_weeks" TO "service_role";



GRANT ALL ON SEQUENCE "public"."completed_weeks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."completed_weeks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."completed_weeks_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."exercise_progress" TO "anon";
GRANT ALL ON TABLE "public"."exercise_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."exercise_progress" TO "service_role";



GRANT ALL ON SEQUENCE "public"."exercise_progress_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."exercise_progress_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."exercise_progress_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."exercise_sets" TO "anon";
GRANT ALL ON TABLE "public"."exercise_sets" TO "authenticated";
GRANT ALL ON TABLE "public"."exercise_sets" TO "service_role";



GRANT ALL ON SEQUENCE "public"."exercise_sets_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."exercise_sets_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."exercise_sets_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."exercises" TO "anon";
GRANT ALL ON TABLE "public"."exercises" TO "authenticated";
GRANT ALL ON TABLE "public"."exercises" TO "service_role";



GRANT ALL ON SEQUENCE "public"."exercises_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."exercises_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."exercises_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."rewards" TO "anon";
GRANT ALL ON TABLE "public"."rewards" TO "authenticated";
GRANT ALL ON TABLE "public"."rewards" TO "service_role";



GRANT ALL ON SEQUENCE "public"."rewards_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."rewards_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."rewards_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."sections" TO "anon";
GRANT ALL ON TABLE "public"."sections" TO "authenticated";
GRANT ALL ON TABLE "public"."sections" TO "service_role";



GRANT ALL ON SEQUENCE "public"."sections_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."sections_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."sections_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_progress" TO "anon";
GRANT ALL ON TABLE "public"."user_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."user_progress" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_progress_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_progress_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_progress_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."workout_sections" TO "anon";
GRANT ALL ON TABLE "public"."workout_sections" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_sections" TO "service_role";



GRANT ALL ON SEQUENCE "public"."workout_sections_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."workout_sections_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."workout_sections_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."workouts" TO "anon";
GRANT ALL ON TABLE "public"."workouts" TO "authenticated";
GRANT ALL ON TABLE "public"."workouts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."workouts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."workouts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."workouts_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
