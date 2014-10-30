var fs = require('fs'),
	xml2js = require('xml2js'),
	Netmask = require('netmask').Netmask,
	util = require('util');
var parser = new xml2js.Parser();
var address = [];
var group_address = [];
parser.on('end', function(result) {
	result.AzurePublicIpAddresses.Region.forEach(function(region) {
		region.IpRange.forEach(function(ip_range) {
			var block = new Netmask(ip_range['$'].Subnet);
			
			//address.push(util.format('set address "Untrust" "%s_%s" %s %s', region['$'].Name, block.base, block.base, block.mask));
			//group_address.push(util.format('set group address "Untrust" "Azure_%s" add "%s_%s"', region['$'].Name, region['$'].Name, block.base));

			address.push(util.format('set security zones security-zone Untrust address-book address %s_%s %s', region['$'].Name, block.base, ip_range['$'].Subnet));
			group_address.push(util.format('set security zones security-zone Untrust address-book address-set Azure_%s address %s_%s', region['$'].Name, region['$'].Name, block.base));
		});
	});
	address.forEach(function(a) { console.log(a); });
	group_address.forEach(function(a) { console.log(a); });
});
fs.readFile(__dirname + '/data.xml', function(err, data) { parser.parseString(data); });
