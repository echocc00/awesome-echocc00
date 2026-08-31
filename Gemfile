source "https://rubygems.org"

# Use Jekyll 3.x because the repo's _config.yml uses minima theme
# syntax authored against the 3.x series (minima 2.5).
gem "jekyll", "~> 3.10.0"
gem "tzinfo-data", platforms: [:windows, :jruby, :mingw, :mswin]

# --- Ruby 3.4 stdlib availability shim ---
# Ruby 3.4 promoted several former-default gems to "bundled" status,
# which means Bundler's exec path requires them to be explicit deps even
# though Jekyll 3.x / liquid 4 / safe_yaml transitively require them.
# Reference: https://github.com/jekyll/jekyll/issues/9620
gem "base64"
gem "bigdecimal"
gem "csv"
gem "logger"
gem "mutex_m"
gem "drb"
gem "stringio"
gem "benchmark"
gem "webrick"

# No theme gem needed: the site uses root index.html (self-contained) and
# explicitly sets theme: null in _config.yml.
