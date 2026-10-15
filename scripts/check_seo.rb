require 'nokogiri'
require 'json'
require 'uri'
require 'cgi'
root = ARGV.fetch(0)
baseline = ARGV[1]
origin = 'https://www.sachiekobayashi.com'
errors = []
check = ->(ok, message) { errors << message unless ok }
pages = Dir.glob("#{root}/**/*.html")
docs = {}
pages.each do |file|
  path = '/' + file.delete_prefix(root + '/').sub(/index\.html$/, '')
  doc = Nokogiri::HTML(File.read(file))
  docs[path] = doc
  next if ['/404.html', '/404/', '/ARCHIVE_MANIFEST/', '/page2/'].include?(path)
  check.call(doc.css('title').length == 1, "#{path}: duplicate title")
  check.call(doc.at_css('meta[name=\"description\"]')['content'].to_s.length <= 220, "#{path}: overly long description")
  canonical = doc.css('link[rel="canonical"]')
  check.call(canonical.length == 1 && URI::DEFAULT_PARSER.unescape(canonical.first&.[]('href').to_s) == origin + path, "#{path}: canonical mismatch")
  check.call(doc.css('meta[name="description"]').length == 1 && !doc.at_css('meta[name="description"]')['content'].to_s.strip.empty?, "#{path}: missing description")
  check.call(!doc.css('meta[name="robots"]').any? { |m| m['content'].to_s.include?('noindex') }, "#{path}: noindex")
end
check.call(docs['/'].at_css('title').text == '小林祥恵 | Sachie Kobayashi — 作曲家・サウンドアーティスト', 'Home: title')
check.call(docs['/'].at_css('.home-intro')&.text.to_s.include?('小林祥恵'), 'Home: visible Japanese identity')
pair = {'en' => '/bio/', 'ja' => '/ja/profile/', 'x-default' => '/bio/'}
['/bio/', '/ja/profile/'].each do |path|
  doc = docs[path]
  check.call(!doc.nil?, "#{path}: missing profile")
  next unless doc
  alternates = doc.css('link[hreflang]').to_h { |n| [n['hreflang'], n['href']] }
  check.call(alternates == pair.transform_values { |v| origin + v }, "#{path}: non-reciprocal hreflang")
  check.call(doc.at_css('html')['lang'] == (path == '/bio/' ? 'en' : 'ja'), "#{path}: language")
end
['/', '/bio/', '/ja/profile/'].each do |path|
  doc = docs[path]
  next unless doc
  data = doc.css('script[type="application/ld+json"]').map { |n| JSON.parse(n.text) }
  person = data.find { |d| d['@type'] == 'Person' }
  check.call(person && person['name'] == '小林祥恵' && person['alternateName'].include?('Sachie Kobayashi') && person['jobTitle'].include?('作曲家') && person['url'] == origin + '/' && person['sameAs'].include?('https://brahms.ircam.fr/en/composer/sachie-kobayashi'), "#{path}: Person identity")
end
sitemap = Nokogiri::XML(File.read("#{root}/sitemap.xml"))
locs = sitemap.xpath('//*[local-name()="loc"]').map(&:text)
check.call(locs.include?(origin + '/ja/profile/') && locs.include?(origin + '/bio/'), 'Sitemap: profiles')
check.call(locs.all? { |u| u.start_with?(origin + '/') } && !locs.any? { |u| u.end_with?('/404.html', '/404/', '/robots.txt') }, 'Sitemap: canonical host / exclusions')
check.call(File.read("#{root}/robots.txt").include?("Sitemap: #{origin}/sitemap.xml"), 'Robots: sitemap host')
if baseline
  old_paths = Dir.glob("#{baseline}/**/*.html").map { |f| f.delete_prefix(baseline + '/').sub('être/', 'e-tre/') }
  check.call((old_paths - pages.map { |f| f.delete_prefix(root + '/') }).empty?, 'Existing HTML URLs removed')
  old_bio = Nokogiri::HTML(File.read("#{baseline}/bio/index.html"))
  old_bio.css('.bio-page p').select { |n| n.text.match?(/Sachie Kobayashi \(1990\)|Born in Kanagawa|She has received|From 2021|She collaborated|In 2020|She started/) }.each do |para|
    check.call(docs['/bio/'].text.include?(para.text), 'Original English paragraph changed')
  end
  old_work_files = Dir.glob("#{baseline}/**/*.html").select { |f| Nokogiri::HTML(File.read(f)).at_css('article.posts') }
  old_work_files.each do |f|
    new_doc = Nokogiri::HTML(File.read(f.sub(baseline, root).sub('être/', 'e-tre/')))
    check.call(Nokogiri::HTML(File.read(f)).at_css('article.posts .entry').to_html == new_doc.at_css('article.posts .entry').to_html, "Work body changed: #{f}")
  end
end
check.call(docs['/page2/'] && docs['/page2/'].at_css('link[rel="canonical"]')['href'] == origin + '/' && docs['/page2/'].at_css('meta[name="robots"]')['content'].include?('noindex') && !locs.include?(origin + '/page2/'), 'Duplicate pagination: canonical, noindex, sitemap')
['/', '/bio/', '/ja/profile/'].each do |path|
  docs[path].css('.home-intro a, .bio-page a, .profile-ja a, .profile-ja img').each do |n|
    href = n['href'] || n['src']
    next unless href&.start_with?('/')
    target = root + URI::DEFAULT_PARSER.unescape(href.split('#').first)
    check.call(File.file?(target) || File.file?(target + 'index.html'), "#{path}: broken internal URL #{href}")
  end
end
puts "Checked #{pages.size} HTML pages, canonical URLs, metadata, language pairs, Person JSON-LD, sitemap and preserved content."
abort errors.join("\n") unless errors.empty?
puts 'PASS'
