# ForgeRock Identity Cloud - Demonstration Configuration Management Tools

## Disclaimer

The sample code described herein is provided on an "as is" basis, without warranty of any kind, to the fullest extent permitted by law. ForgeRock does not warrant or guarantee the individual success developers may have in implementing the sample code on their development platforms or in production configurations. ForgeRock does not warrant, guarantee or make any representations regarding the use, results of use, accuracy, timeliness or completeness of any data or information relating to the sample code. ForgeRock disclaims all warranties, expressed or implied, and in particular, disclaims all warranties of merchantability, and warranties related to the code, or any service or software related thereto.

ForgeRock shall not be liable for any direct, indirect or consequential damages or costs of any type arising out of any action taken by you or others related to the sample code.

## Introduction

This repository includes sample javascript based tools for managing Identity Cloud configuration in an external repository. The scripts are a starting point for customers who wish to store and manage Identity Cloud configuration in their own repository and automate the export and/or import of this configuration via a CI/CD pipeline or other management framework.

In order to meet the requirements of managing ForgeRock config as code, the tools provide a view of configuration which is:

- **Complete** - a complete representation of all configuration of a tenant
- **Understandable** - all configuration should be as legible and understandable as possible.
- **Modular** - monolithic configuration is broken into its constituent parts for more granular management
- **Predictable** - order and format of configuration does not change if no changes are made.

Note that these tools are not supported by ForgeRock: they are sample code to be adapted or used as-is as part of the customer owned configuration management tooling.

## Packages

This repository provides the following packages

- `fr-config-pull` - A tool to pull configuration from Identity Cloud into a local repository
- `fr-config-push` - A tool to push configuration from a local repository into Identity Cloud

For full usage details, refer to the README in the respective package directories.

## Prerequisites

The tools require the following:

- Node.js
- Access to a ForgeRock Identity Cloud tenant.
- A tenant service account ID and private key.

Refer to the Identity Cloud documentation for details on how to create a service account and obtain its ID and private key.

## Configuration

The tools are configured via the environment, either using a `.env` file in the working directory, or via corresponding environment variables. The `.env.sample` file in the root of this repository provides an example, and should be copied as `.env` to the working directory when running the tool (or used as a reference for setting environment variables).

Refer to the [configuration README](docs/environment.md) for more details.

### Oauth2 agent configuration file

The OAuth2 agent configuration file contains a list of agents to pull from the Identity Cloud tenant, for subsequent push to each target environment.

The path to this file is configured in the `.env` file (or environment directly) as the `OAUTH2_AGENTS_CONFIG` value.

Refer to the [agent configuration README](docs/agents.md) for more details.

### Authorization policy config file

The OAuth2 agent configuration file contains a list of policy sets to pull from the Identity Cloud tenant, for subsequent push to each target environment.

The path to this file is configured in the `.env` file (or environment directly) as the `AUTHZ_POLICY_SETS_CONFIG` value.

Refer to the [policy configuration README](docs/policies.md) for more details.

### Service objects config file

The service objects configuration file contains a list of managed objects to pull from the Identity Cloud tenant, for subsequent push to each target environment.

The path to this file is configured in the `.env` file (or environment directly) as the `SERVICE_OBJECTS_CONFIG` value.

Refer to the [configuration README](docs/service-objects.md) for more details.

## Exported configuration

The `fr-config-pull` tool exports ForgeRock configuration to the local filesystem as a set of json files in a directory structure that represents both global and realm specific configuration.

The `fr-config-push` tool imports ForgeRock configuration from the local filesystem to the ForgeRock platform: the tool expects configuration to be structured as per the `fr-config-pull` output.

Refer to the [export contents README](docs/contents.md) for more details of the configuration structure.

## Quickstart

To get started, create a baseline repo with your initial Identity Cloud configuration as a baseline, with the following steps

- Clone the `fr-config-manager` repository to your workstation and configure the tools
- Create an empty configuration repository and clone to your workstation
- Use `fr-config-pull` to populate the local clone of the configuration repository
- Merge the baseline configuration to the main branch in the repo

### Clone the config manager repository and build the pull tool

```
mkdir ~/identity-cloud
cd ~/identity-cloud
git clone https://github.com/ForgeRock/fr-config-manager.git
cd fr-config-manager
git checkout v1.0.0
npm install --ws
cd packages/fr-config-pull
npm link
```

### Create a blank github repo and clone

```
cd ~/identity-cloud
git clone https://github.com/my-org/identity-cloud-config

```

### Configure tenant access

```
cd ~/identity-cloud
cp ~/fr-config-manager/.env.sample ./.env
```

Edit the `.env` file as per instructions above, using the cloned repo as the config target directory - i.e. in your `.env` file:

`CONFIG_DIR=fr-config-manager`

### Pull config, commit and push

```
cd ~/identity-cloud/identity-cloud-config
git checkout -b initial-config
cd ~/identity-cloud
fr-config-pull
cd ~/identity-cloud/identity-cloud-config
git add .
git commit -m "Initial config"
git push origin initial-config
```

### Merge

You can now create a pull request for the `initial-config` branch in github and merge, and optionally tag.
