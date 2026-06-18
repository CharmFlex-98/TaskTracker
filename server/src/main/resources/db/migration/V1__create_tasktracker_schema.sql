create table if not exists tasktracker_users (
    id varchar(128) primary key,
    email varchar(320),
    display_name varchar(255),
    avatar_url varchar(1024),
    created_at timestamp not null,
    updated_at timestamp not null
);

create table if not exists projects (
    id varchar(36) primary key,
    owner_id varchar(128) not null,
    name varchar(160) not null,
    description varchar(2000),
    status varchar(32) not null,
    created_at timestamp not null,
    updated_at timestamp not null,
    constraint fk_projects_owner foreign key (owner_id) references tasktracker_users(id) on delete cascade
);

create index if not exists idx_projects_owner_updated on projects(owner_id, updated_at);

create table if not exists tasks (
    id varchar(36) primary key,
    owner_id varchar(128) not null,
    project_id varchar(36) not null,
    title varchar(200) not null,
    description varchar(4000),
    status varchar(32) not null,
    priority varchar(32) not null,
    due_date date,
    progress integer not null,
    created_at timestamp not null,
    updated_at timestamp not null,
    constraint fk_tasks_owner foreign key (owner_id) references tasktracker_users(id) on delete cascade,
    constraint fk_tasks_project foreign key (project_id) references projects(id) on delete cascade
);

create index if not exists idx_tasks_owner_updated on tasks(owner_id, updated_at);
create index if not exists idx_tasks_project_updated on tasks(project_id, updated_at);
