source "https://rubygems.org"

# Jekyll 3.10 is pinned because the repo's _config.yml uses minima theme
# syntax authored against the 3.x series.
gem "jekyll", "~> 3.10.0"

# Ruby 3.4 stopped shipping base64 as a default gem. safe_yaml (a Jekyll 3.x
# transitive dep) requires base64 at load time, so bundle exec jekyll build
# fails with "cannot load such file -- base64" on Ruby 3.4. Declare it
# explicitly so bundler resolves and links it.
gem "base64"

# tzinfo-data needs to be on platforms without a system tz database.
gem "tzinfo-data", platforms: [:windows, :jruby, :mingw, :mswin]
