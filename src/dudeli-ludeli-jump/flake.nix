{
	description = "phaser-game";
	
	inputs.nixpkgs.url = "nixpkgs/nixos-23.05";
	inputs.flake-utils.url = "github:numtide/flake-utils";
	
	outputs = { self, nixpkgs, flake-utils }:
		flake-utils.lib.eachDefaultSystem
			(system:
		    let pkgs = import nixpkgs {
					inherit system;
				};
				in {
          devShell = pkgs.mkShell {
						nativeBuildInputs = with pkgs; [
							nodejs_20
							nodePackages.eslint
							nodePackages.typescript
							nodePackages.typescript-language-server
							yarn
							pre-commit
						];
					};
        }
		  );
}
