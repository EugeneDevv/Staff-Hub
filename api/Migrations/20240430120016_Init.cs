using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Clients",
                columns: table => new
                {
                    ClientId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    ClientName = table.Column<string>(type: "text", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clients", x => x.ClientId);
                });

            migrationBuilder.CreateTable(
                name: "ProjectRole",
                columns: table => new
                {
                    ProjectRoleId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    ProjectRoleName = table.Column<string>(type: "text", nullable: false),
                    deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectRole", x => x.ProjectRoleId);
                });

            migrationBuilder.CreateTable(
                name: "SecurityAnswers",
                columns: table => new
                {
                    AnswerId = table.Column<Guid>(type: "uuid", nullable: false),
                    Answer = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    QuestionId = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SecurityAnswers", x => x.AnswerId);
                });

            migrationBuilder.CreateTable(
                name: "SecurityQuestions",
                columns: table => new
                {
                    QuestionId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    QuestionName = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SecurityQuestions", x => x.QuestionId);
                });

            migrationBuilder.CreateTable(
                name: "Skills",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    deleted = table.Column<bool>(type: "boolean", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Skills", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    FirstName = table.Column<string>(type: "text", nullable: true),
                    LastName = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PhoneNumber = table.Column<string>(type: "text", nullable: false),
                    Password = table.Column<string>(type: "text", nullable: false),
                    SecurityQuestion = table.Column<bool>(type: "boolean", nullable: true),
                    Role = table.Column<string>(type: "text", nullable: false),
                    AccountStatus = table.Column<string>(type: "text", nullable: false),
                    ProfileStatus = table.Column<string>(type: "text", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Otp = table.Column<int>(type: "integer", nullable: false),
                    Suspended = table.Column<bool>(type: "boolean", nullable: false),
                    Deleted = table.Column<bool>(type: "boolean", nullable: false),
                    SuspensionReason = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    ProjectId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    ProjectName = table.Column<string>(type: "text", nullable: false),
                    ClientsId = table.Column<int>(type: "integer", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.ProjectId);
                    table.ForeignKey(
                        name: "FK_Projects_Clients_ClientsId",
                        column: x => x.ClientsId,
                        principalTable: "Clients",
                        principalColumn: "ClientId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Certifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Issuer = table.Column<string>(type: "text", nullable: true),
                    Code = table.Column<string>(type: "text", nullable: true),
                    IssueMonth = table.Column<string>(type: "text", nullable: true),
                    IssueYear = table.Column<int>(type: "integer", nullable: true),
                    ExpiryMonth = table.Column<string>(type: "text", nullable: true),
                    ExpiryYear = table.Column<int>(type: "integer", nullable: true),
                    CertificateLink = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    IsOngoing = table.Column<bool>(type: "boolean", nullable: false),
                    userId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Certifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Certifications_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "Educations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AreaOfStudy = table.Column<string>(type: "text", nullable: false),
                    Institution = table.Column<string>(type: "text", nullable: false),
                    LevelOfEducation = table.Column<string>(type: "text", nullable: false),
                    StartMonth = table.Column<string>(type: "text", nullable: true),
                    StartYear = table.Column<int>(type: "integer", nullable: true),
                    EndMonth = table.Column<string>(type: "text", nullable: true),
                    EndYear = table.Column<int>(type: "integer", nullable: true),
                    IsContinuing = table.Column<bool>(type: "boolean", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Educations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Educations_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "Experiences",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    JobTitle = table.Column<string>(type: "text", nullable: false),
                    CompanyName = table.Column<string>(type: "text", nullable: false),
                    startMonth = table.Column<string>(type: "text", nullable: true),
                    startYear = table.Column<int>(type: "integer", nullable: true),
                    endMonth = table.Column<string>(type: "text", nullable: true),
                    endYear = table.Column<int>(type: "integer", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    IsOngoing = table.Column<bool>(type: "boolean", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Experiences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Experiences_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "UserSkills",
                columns: table => new
                {
                    SkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Id = table.Column<int>(type: "integer", nullable: false),
                    ProficiencyLevel = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSkills", x => new { x.UserId, x.SkillId });
                    table.ForeignKey(
                        name: "FK_UserSkills_Skills_SkillId",
                        column: x => x.SkillId,
                        principalTable: "Skills",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_UserSkills_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "UserProjectRoles",
                columns: table => new
                {
                    ProjectId = table.Column<int>(type: "integer", nullable: false),
                    ProjectRoleId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StartMonth = table.Column<string>(type: "text", nullable: true),
                    StartYear = table.Column<int>(type: "integer", nullable: true),
                    EndMonth = table.Column<string>(type: "text", nullable: true),
                    EndYear = table.Column<int>(type: "integer", nullable: true),
                    IsContinuing = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProjectRoles", x => new { x.UserId, x.ProjectId, x.ProjectRoleId });
                    table.ForeignKey(
                        name: "FK_UserProjectRoles_ProjectRole_ProjectRoleId",
                        column: x => x.ProjectRoleId,
                        principalTable: "ProjectRole",
                        principalColumn: "ProjectRoleId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserProjectRoles_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserProjectRoles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Clients",
                columns: new[] { "ClientId", "ClientName", "IsDeleted" },
                values: new object[,]
                {
                    { 1, "ACL", false },
                    { 2, "Howard", false },
                    { 3, "Chick-Fil-A", false },
                    { 4, "RAM", false },
                    { 5, "Internal Project", false },
                    { 6, "PRISIM", false },
                    { 7, "CelebriAI", false }
                });

            migrationBuilder.InsertData(
                table: "ProjectRole",
                columns: new[] { "ProjectRoleId", "ProjectRoleName", "deleted" },
                values: new object[,]
                {
                    { 1, "Developer", false },
                    { 2, "Business Analyst", false },
                    { 3, "QA/QE", false },
                    { 4, "Scrum Master", false },
                    { 5, "RPA Developer", false },
                    { 6, "Solution Delivery Leader", false },
                    { 7, "Solution Architect", false }
                });

            migrationBuilder.InsertData(
                table: "SecurityQuestions",
                columns: new[] { "QuestionId", "QuestionName" },
                values: new object[,]
                {
                    { 1, "What's your mother's Maiden name?" },
                    { 2, "What's the name of your pet?" },
                    { 3, "In which city were you born" },
                    { 4, "Which high school did you attend" },
                    { 5, "What was the name of your elementary school?" },
                    { 6, "What was the make of your first car" },
                    { 7, "What was your favorite food as a child?" }
                });

            migrationBuilder.InsertData(
                table: "Skills",
                columns: new[] { "Id", "Name", "deleted" },
                values: new object[,]
                {
                    { new Guid("01f8a9df-2b45-4623-a1b8-75d4fb97bcb4"), "Cypress", false },
                    { new Guid("4c66e09a-de93-44dd-941b-28ab92333a30"), "React", false },
                    { new Guid("dee9f4f9-f455-41bc-812c-2d00d268416a"), "Python", false },
                    { new Guid("e219b4e3-104c-41ac-842a-2709052a5517"), "Java", false },
                    { new Guid("f2e19442-242d-4f55-b643-6611ff02d9ea"), "AWS-CCP", false }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "AccountStatus", "DateCreated", "DateUpdated", "Deleted", "Email", "FirstName", "LastName", "Otp", "Password", "PhoneNumber", "ProfileStatus", "Role", "SecurityQuestion", "Suspended", "SuspensionReason" },
                values: new object[,]
                {
                    { new Guid("124fe2e4-c1d1-4201-8d1b-cab77d29a931"), "new", new DateTime(2024, 4, 30, 12, 0, 10, 543, DateTimeKind.Utc).AddTicks(623), new DateTime(2024, 4, 30, 12, 0, 10, 543, DateTimeKind.Utc).AddTicks(630), false, "user2@griffinglobaltech.com", "Alice", "Kate", 0, "$2a$11$MQUqy/up42tr7GGvzKIoieTMRWeJAyNcdyV5EodmllwIMtHN34qty", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("175d8ed0-70d7-4e14-8bdc-6a419b839c01"), "new", new DateTime(2024, 4, 30, 12, 0, 13, 800, DateTimeKind.Utc).AddTicks(9513), new DateTime(2024, 4, 30, 12, 0, 13, 800, DateTimeKind.Utc).AddTicks(9518), false, "user17@griffinglobaltech.com", "Alice", "Samuel", 0, "$2a$11$9QULDLnY75LNX10N1okmD.ZPCElQOfMK1vSIeNwyk8ghne/UTwbVq", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("18619479-22fb-4d4d-ba23-b82a98cf8f46"), "new", new DateTime(2024, 4, 30, 12, 0, 10, 321, DateTimeKind.Utc).AddTicks(7164), new DateTime(2024, 4, 30, 12, 0, 10, 321, DateTimeKind.Utc).AddTicks(7168), false, "user1@griffinglobaltech.com", "Victor", "Patrick", 0, "$2a$11$K6kYbrHtL9AyqE/cqgH2BOr/0TteDNE6bS.jvowCixS0uf0pZ8nTK", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("1ef0eb62-4aaf-4aec-b500-2f38f262f47d"), "new", new DateTime(2024, 4, 30, 12, 0, 15, 306, DateTimeKind.Utc).AddTicks(1204), new DateTime(2024, 4, 30, 12, 0, 15, 306, DateTimeKind.Utc).AddTicks(1210), false, "user25@griffinglobaltech.com", "Zane", "Taylor", 0, "$2a$11$RqXdsJ4fRQin5RHyuOGbPOOo8z3Lu9PqaI/roFG4woqQT1niHF0CW", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("212006a4-a354-4b49-b779-aa0c37f5d13f"), "new", new DateTime(2024, 4, 30, 12, 0, 11, 61, DateTimeKind.Utc).AddTicks(8923), new DateTime(2024, 4, 30, 12, 0, 11, 61, DateTimeKind.Utc).AddTicks(8931), false, "user4@griffinglobaltech.com", "Kate", "Alice", 0, "$2a$11$NWRRF2ZsIbpLrPLrniWafer8gOY3OtZ/VCDX7MMXQ9Qawms7FiGga", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("3c1f1d59-2057-46c0-a0c3-541536c8110d"), "new", new DateTime(2024, 4, 30, 12, 0, 14, 185, DateTimeKind.Utc).AddTicks(5733), new DateTime(2024, 4, 30, 12, 0, 14, 185, DateTimeKind.Utc).AddTicks(5737), false, "user19@griffinglobaltech.com", "David", "Alice", 0, "$2a$11$F6idK2OInTCCy3deknR5kuk/z9y2nW4OuasHYZNNn86hAnEQChbD.", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("423e8df4-dd01-45c1-956f-446bcad2448f"), "new", new DateTime(2024, 4, 30, 12, 0, 11, 923, DateTimeKind.Utc).AddTicks(5144), new DateTime(2024, 4, 30, 12, 0, 11, 923, DateTimeKind.Utc).AddTicks(5158), false, "user8@griffinglobaltech.com", "Henry", "Xavier", 0, "$2a$11$PnHreXkHQQu4h8ooQ/icN.Rq88gMw8JBLoKJFCr2FaOTqNuYhFAdO", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("492986eb-6b14-448e-bb5a-ef160139641b"), "new", new DateTime(2024, 4, 30, 12, 0, 12, 478, DateTimeKind.Utc).AddTicks(9007), new DateTime(2024, 4, 30, 12, 0, 12, 478, DateTimeKind.Utc).AddTicks(9013), false, "user11@griffinglobaltech.com", "Samuel", "Olivia", 0, "$2a$11$XucF7gK2pAf5Nw5aaWbm4es8ybtFLSHEVhyhWhOPLMt5vI4qp.wRm", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("4affac57-e571-460b-9556-0c08f33c924e"), "new", new DateTime(2024, 4, 30, 12, 0, 12, 708, DateTimeKind.Utc).AddTicks(7934), new DateTime(2024, 4, 30, 12, 0, 12, 708, DateTimeKind.Utc).AddTicks(7943), false, "user12@griffinglobaltech.com", "Mia", "Zane", 0, "$2a$11$2fvhjQB39XqhpNgKCk1Uluh6l7Ap/ZAwKqrfp6sHlUQeNny9JXyci", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("50e353f8-f8fd-4065-902a-503c5657a6a5"), "new", new DateTime(2024, 4, 30, 12, 0, 13, 584, DateTimeKind.Utc).AddTicks(3242), new DateTime(2024, 4, 30, 12, 0, 13, 584, DateTimeKind.Utc).AddTicks(3250), false, "user16@griffinglobaltech.com", "Victor", "Xavier", 0, "$2a$11$Z6sY.lmtrRB5w7MAqsIjou.atumD7X0s4Sbc5DjLTyJCwQdZc4ffy", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("55c6b08b-ab29-45a3-9d2d-692f0b779e43"), "new", new DateTime(2024, 4, 30, 12, 0, 12, 293, DateTimeKind.Utc).AddTicks(5515), new DateTime(2024, 4, 30, 12, 0, 12, 293, DateTimeKind.Utc).AddTicks(5520), false, "user10@griffinglobaltech.com", "Victor", "Wendy", 0, "$2a$11$l7Nr1sNtMl/qBFRSe0m8X.0BEdUa2NGVhmcMjP6s2a9vjns7yNmQW", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("5b2d249e-21a5-4ecd-9312-839eb051975b"), "new", new DateTime(2024, 4, 30, 12, 0, 14, 943, DateTimeKind.Utc).AddTicks(3231), new DateTime(2024, 4, 30, 12, 0, 14, 943, DateTimeKind.Utc).AddTicks(3236), false, "user23@griffinglobaltech.com", "Taylor", "David", 0, "$2a$11$3dr2MpB/IzaCygX4neUi3OuKn9GNCxzeVHJsm9BfYQEOQeTIABbXO", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("5f4c3204-5c8a-462d-8bf4-41acc6e41755"), "new", new DateTime(2024, 4, 30, 12, 0, 11, 705, DateTimeKind.Utc).AddTicks(8119), new DateTime(2024, 4, 30, 12, 0, 11, 705, DateTimeKind.Utc).AddTicks(8123), false, "user7@griffinglobaltech.com", "Wendy", "Nathan", 0, "$2a$11$nxmLGB55M4az5MfBNmn0ZeYheJHp8K94F6NcLJ5lmFrYP2UiRxsfS", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("63e4535a-e62d-4883-be3d-619f8503ba10"), "new", new DateTime(2024, 4, 30, 12, 0, 10, 819, DateTimeKind.Utc).AddTicks(3564), new DateTime(2024, 4, 30, 12, 0, 10, 819, DateTimeKind.Utc).AddTicks(3568), false, "user3@griffinglobaltech.com", "Zane", "Wendy", 0, "$2a$11$DCgA8t0wZAAC3laSwPH0yuwEt.1AYWErcfwZdkTL36dIDN66xWG/K", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("6577c446-5a5f-4698-9486-3e907b703f00"), "new", new DateTime(2024, 4, 30, 12, 0, 12, 115, DateTimeKind.Utc).AddTicks(6445), new DateTime(2024, 4, 30, 12, 0, 12, 115, DateTimeKind.Utc).AddTicks(6454), false, "user9@griffinglobaltech.com", "Xavier", "Frank", 0, "$2a$11$fz7iEEzOOTIyPxF/IgEe/ePg3cF.cDIOrRVvBYhj3dPY0CCgUUpYq", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("6d5f4f5f-afbb-4561-a37c-82810caa8916"), "new", new DateTime(2024, 4, 30, 12, 0, 14, 554, DateTimeKind.Utc).AddTicks(3253), new DateTime(2024, 4, 30, 12, 0, 14, 554, DateTimeKind.Utc).AddTicks(3258), false, "user21@griffinglobaltech.com", "Grace", "Olivia", 0, "$2a$11$lc0P5K0OzqpT.8ZTE1xpveplzmSIq/RTXSBBc0IBCfTbEPNjR95au", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("73462e36-86ff-4558-b676-2f9c9c01e1c2"), "new", new DateTime(2024, 4, 30, 12, 0, 13, 361, DateTimeKind.Utc).AddTicks(4820), new DateTime(2024, 4, 30, 12, 0, 13, 361, DateTimeKind.Utc).AddTicks(4825), false, "user15@griffinglobaltech.com", "Grace", "Samuel", 0, "$2a$11$lENnd5s8lspe1AYOJVnZQupqeMOS07rO1UIqmoqCmAld2oozv0egy", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("9662d61c-fa8b-4ffd-a419-fc2541655e43"), "new", new DateTime(2024, 4, 30, 12, 0, 11, 291, DateTimeKind.Utc).AddTicks(3926), new DateTime(2024, 4, 30, 12, 0, 11, 291, DateTimeKind.Utc).AddTicks(3931), false, "user5@griffinglobaltech.com", "Wendy", "Ella", 0, "$2a$11$uv1u36S0k8n4uhJE98RKvuvnR7bueLiEgiwrWc6M1RnK/LKvBC8Cq", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("9bc02bfd-b22e-48a4-863a-91e8355f65bb"), "new", new DateTime(2024, 4, 30, 12, 0, 13, 144, DateTimeKind.Utc).AddTicks(1129), new DateTime(2024, 4, 30, 12, 0, 13, 144, DateTimeKind.Utc).AddTicks(1133), false, "user14@griffinglobaltech.com", "Ella", "Liam", 0, "$2a$11$SNI3NNEV0udLp1alTaoQ2eCQbCM/YF1323f.m0bHvPjD.pIve724K", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("9ea9cf59-dee1-478b-9989-094ba7a46a73"), "new", new DateTime(2024, 4, 30, 12, 0, 15, 134, DateTimeKind.Utc).AddTicks(605), new DateTime(2024, 4, 30, 12, 0, 15, 134, DateTimeKind.Utc).AddTicks(609), false, "user24@griffinglobaltech.com", "Victor", "Wendy", 0, "$2a$11$XntEEp1za/UsZTSHKuufu.mpvrwEhUYf8cJMrSJdBsk98fsv/.7gC", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("a7776fa8-2270-412d-beb8-ecd1b7dc4639"), "new", new DateTime(2024, 4, 30, 12, 0, 14, 359, DateTimeKind.Utc).AddTicks(1515), new DateTime(2024, 4, 30, 12, 0, 14, 359, DateTimeKind.Utc).AddTicks(1522), false, "user20@griffinglobaltech.com", "Xavier", "Kate", 0, "$2a$11$I5EFxRDFRcj0sBtpwQgcm.tlq90QPtLxy4WUH/6pWCQk3gnkmFLr.", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("ac492e48-6ac9-4738-a974-0b741f0524d2"), "new", new DateTime(2024, 4, 30, 12, 0, 11, 495, DateTimeKind.Utc).AddTicks(5856), new DateTime(2024, 4, 30, 12, 0, 11, 495, DateTimeKind.Utc).AddTicks(5861), false, "user6@griffinglobaltech.com", "Patrick", "Liam", 0, "$2a$11$F1XvdPRXmkXRVxSHUGd78u/ldWIlW6sFHswDkBGaAvoBG/0i5YvgC", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("c8f18212-97a1-4e23-8939-1973a245cc42"), "new", new DateTime(2024, 4, 30, 12, 0, 12, 943, DateTimeKind.Utc).AddTicks(8428), new DateTime(2024, 4, 30, 12, 0, 12, 943, DateTimeKind.Utc).AddTicks(8434), false, "user13@griffinglobaltech.com", "Quinn", "Charlie", 0, "$2a$11$7lo2YEeR5RdnbltuTYKqhO1k4oDZQXePcZpZ.rRHtkK9BQBfw/2hy", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("e2b59d17-ad2d-4013-a469-ac4820f99de9"), "new", new DateTime(2024, 4, 30, 12, 0, 13, 993, DateTimeKind.Utc).AddTicks(4654), new DateTime(2024, 4, 30, 12, 0, 13, 993, DateTimeKind.Utc).AddTicks(4659), false, "user18@griffinglobaltech.com", "Taylor", "Alice", 0, "$2a$11$p6fVhp64NVV2Uq3YZM/Q4uBn2k0Za095I2/7PC9u4WHASlQhCkIQu", "123-456-7890", "pending", "User", false, false, null },
                    { new Guid("f773aa0c-0727-4431-99fd-327b9fb12d18"), "new", new DateTime(2024, 4, 30, 12, 0, 14, 748, DateTimeKind.Utc).AddTicks(3312), new DateTime(2024, 4, 30, 12, 0, 14, 748, DateTimeKind.Utc).AddTicks(3316), false, "user22@griffinglobaltech.com", "Alice", "Patrick", 0, "$2a$11$.b5Me/yRocO.qJaiukdkPOl1Iuzgrw2CYFy2hor2w0W4GOTN6AMBi", "123-456-7890", "pending", "User", false, false, null }
                });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "ProjectId", "ClientsId", "IsDeleted", "ProjectName" },
                values: new object[,]
                {
                    { 1, 3, false, "DRB" },
                    { 2, 3, false, "SC-MVP" },
                    { 3, 3, false, "Data Exchange QA Automation" },
                    { 4, 6, false, "PRISM HR" },
                    { 5, 2, false, "Advisor Portal" },
                    { 6, 2, false, "401K Optimizer" },
                    { 7, 2, false, "TSP Optimizer" },
                    { 8, 2, false, "HCM Fund Site" },
                    { 9, 2, false, "ETFs Site" },
                    { 10, 2, false, "Marketing Site" },
                    { 11, 1, false, "Legacy" },
                    { 12, 1, false, "Bot" },
                    { 13, 1, false, "CAP" },
                    { 14, 7, false, "File Tracker" },
                    { 15, 7, false, "ATQ V2" },
                    { 16, 5, false, "GER " }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Certifications_userId",
                table: "Certifications",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_Educations_UserId",
                table: "Educations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Experiences_UserId",
                table: "Experiences",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ClientsId",
                table: "Projects",
                column: "ClientsId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProjectRoles_ProjectId",
                table: "UserProjectRoles",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProjectRoles_ProjectRoleId",
                table: "UserProjectRoles",
                column: "ProjectRoleId");

            migrationBuilder.CreateIndex(
                name: "IX_UserSkills_SkillId",
                table: "UserSkills",
                column: "SkillId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Certifications");

            migrationBuilder.DropTable(
                name: "Educations");

            migrationBuilder.DropTable(
                name: "Experiences");

            migrationBuilder.DropTable(
                name: "SecurityAnswers");

            migrationBuilder.DropTable(
                name: "SecurityQuestions");

            migrationBuilder.DropTable(
                name: "UserProjectRoles");

            migrationBuilder.DropTable(
                name: "UserSkills");

            migrationBuilder.DropTable(
                name: "ProjectRole");

            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "Skills");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Clients");
        }
    }
}
