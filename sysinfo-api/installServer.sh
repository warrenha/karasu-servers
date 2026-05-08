#!/bin/bash

# Don't include "optionalDependencies" (macos-temperature-sensor)

pnpm install --frozen-lockfile --prod --no-optional
