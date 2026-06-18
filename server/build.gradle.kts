import org.springframework.boot.gradle.tasks.bundling.BootBuildImage

plugins {
    kotlin("jvm") version "1.9.25"
    kotlin("plugin.spring") version "1.9.25"
    id("org.springframework.boot") version "3.5.6"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com.tasktracker"
version = "0.0.1-SNAPSHOT"
description = "TaskTracker server"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-jdbc")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")
    runtimeOnly("org.postgresql:postgresql")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("com.google.firebase:firebase-admin:9.4.3")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
}

tasks.named<BootBuildImage>("bootBuildImage") {
    val dockerUsername = System.getenv("DOCKER_LOGIN_USERNAME")
    val dockerPassword = System.getenv("DOCKER_LOGIN_PW")
    imageName.set("charmflex/server-${project.name}")
    publish.set(!dockerUsername.isNullOrBlank() && !dockerPassword.isNullOrBlank())
    docker {
        publishRegistry {
            username.set(dockerUsername)
            password.set(dockerPassword)
        }
    }
}
