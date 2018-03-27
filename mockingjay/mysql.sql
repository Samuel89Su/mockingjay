create table `app` (
    `id` int not null primary key auto_increment,
    `name` varchar(30) not null,
    `desc` varchar(200),
    `apiForwardTarget` varchar(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table `app_api_forward_target` (
    `id` int not null primary key auto_increment,
    `name` varchar(20) not null,
    `value` varchar(100) not null
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table `api` (
    `id` int not null primary key auto_increment,
    `appId` int not null,
    `path` varchar(100) not null,
    `method` varchar(10) not null,
    `mock` bit(1) not null default b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

